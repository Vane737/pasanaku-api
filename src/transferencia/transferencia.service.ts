import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import e, { Request } from 'express';
import { addMinutes } from 'date-fns/addMinutes';
import { cancelJob, scheduleJob,scheduledJobs,Job } from 'node-schedule';

import { JugadoresService } from 'src/jugadores/jugadores.service';
import { ParticipanteService } from 'src/participante/participante.service';
import { NotificationService } from 'src/notification/notification.service';

import { Participante } from 'src/participante/entities/participante.entity';
import { Transferencia } from './entities/transferencia.entity';
import { Ronda } from 'src/ronda/entities/ronda.entity';

@Injectable()
export class TransferenciaService {
    private readonly logger = new Logger('TransferenciaService') 

    constructor( 
        @InjectRepository( Ronda ) private readonly rondaRepository: Repository<Ronda>,
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        @InjectRepository( Transferencia ) private readonly transferenciaRepository: Repository<Transferencia>,
        private readonly jugadoresService: JugadoresService,
        private readonly notificationService: NotificationService,
        @Inject(forwardRef(() => ParticipanteService)) private readonly participanteService: ParticipanteService,
    ) { }

    async create (ganador: Participante, deudor: Participante, ronda: Ronda): Promise<any>{
        var fecha = new Date();
        var fecha = addMinutes(fecha, 2);
        const transaccion = this.transferenciaRepository.create({ 
          monto: deudor.cuota,
          contador: 0,
          fecha: fecha,
          estado: 'Debe',
          ronda: ronda,
          deudor: deudor,
          receptor: ganador,
        }); 
        await this.transferenciaRepository.save(transaccion);

    }

    async penalizacion(id: number) {
      console.log(id);
      var x = 0;
      const transferencias = await this.transferenciaRepository.find({
        where: {
          ronda: { id: id },
          estado: 'Debe',
          },
        relations: ['ronda.partida', 'deudor.jugador', 'receptor.jugador']
      });  
      var title = "";
      var body = "";
      if( transferencias.length != 0){
        for (const transferencia of transferencias) {    
          if(transferencia.contador < 2){
            var couta = (transferencia.monto * 1.10);        
            couta = Math.ceil(couta);
            transferencia.monto = couta; 
            transferencia.fecha = addMinutes(transferencia.fecha, 1);
            transferencia.contador = transferencia.contador + 1; 
            await this.transferenciaRepository.save(transferencia);

            title = "Penalizacion Aplicada";
            body = `Tu nuevo monto a pagar de la partida ${transferencia.ronda.partida.nombre} ${transferencia.ronda.nombre} es ${transferencia.monto} .`;
            await this.notificationService.sendPushNotificationIndividual(transferencia.deudor.jugador,title,body);        
          }else{
            x = 1;
            var deudor = transferencia.deudor.id;
            var creador = await this.participanteService.creador(transferencia.ronda.partida.id);
            //Si el creador es el deudor
            if(deudor == creador){

            }else {
              //Si el creador es el receptor
              if (creador == transferencia.receptor.id){
              var title = "Jugador Eliminado";
              var body = `El jugador ${transferencia.deudor.jugador.nombre} a sido eliminado tienes que pagar su couta de ahora en adelante.`;
              await this.notificationService.sendPushNotificationIndividual(transferencia.receptor.jugador,title,body); 
              }
              //El creador no es deudor ni receptor, se le aumenta su cuota
              else{
                await this.jugadorEliminado(creador,transferencia.ronda.id,transferencia.deudor.jugador.nombre);
              }              
              await this.participanteService.eliminar(deudor);
              await this.transferenciaRepository.remove( transferencia );
            }
          }
        }  
        if( x == 0){        
          const jobName = `Trans-${id}`;
          try {
            cancelJob(jobName);
          } catch (error) {
            console.error(`Error al cancelar el trabajo: ${error.message}`);
          }
          var f = new Date();
          f = addMinutes(f, 1);
          const fecha = new Date(f);
          scheduleJob(jobName, fecha, () => {
            this.penalizacion(id);
          });
        }
      }
      
    }

    //Devuelve transferencias de un jugador
    async transferencias(id: number, req: Request) {
        const transferencias = await this.transferenciaRepository.find({ 
          where: {
            deudor: { jugador: { id: id } },
          },
          order: {
            fecha: 'DESC', 
          },
          relations: ['ronda.partida','deudor.jugador','receptor.jugador'],
        });   
        const transferenciasSimples = await Promise.all(transferencias.map(async (transferencia) => ({          
          id: transferencia.id,
          monto: transferencia.monto,
          fecha: transferencia.fecha,
          estado: transferencia.estado,
          partida: transferencia.ronda.partida.nombre,
          ronda: transferencia.ronda.nombre,
          deudor: {
            id: transferencia.deudor.jugador.id,
            nombre: transferencia.deudor.jugador.nombre,
          },
          receptor: {
            id: transferencia.receptor.jugador.id,
            nombre: transferencia.receptor.jugador.nombre,
            imagen : await this.jugadoresService.obtenerImagen(transferencia.receptor.jugador.id,req),
          },
        })));
      return transferenciasSimples;
    }
    

    async pagar(id: number) {
      const transferencia = await this.transferenciaRepository.findOne({
          where: { id: id },
          relations: ['ronda.partida','deudor.jugador','receptor.jugador'],
        });            
      transferencia.estado = 'Pagada';
      await this.transferenciaRepository.save(transferencia);  

      var title = "Pago Recibido";
      var body = `El jugador ${transferencia.deudor.jugador.nombre} te a realizado una transferencia .`;
      await this.notificationService.sendPushNotificationIndividual(transferencia.receptor.jugador,title,body); 
      return 'Pagada';
    }


    async jugadorEliminado(creadorId: number, rondaId: number, nombre: string) {
      const transferencia = await this.transferenciaRepository.findOne({
        where: {
          deudor: { id: creadorId },
          ronda: { id: rondaId },
          },
          relations: ['ronda.partida','deudor.jugador'],
        }); 

      if( transferencia != null){
        if(transferencia.estado == 'Pagada'){
          transferencia.estado = 'Debe';
        }else{
          var couta = transferencia.monto * 2;
          couta = Math.ceil(couta);
          transferencia.monto = couta;
        }
        await this.transferenciaRepository.save(transferencia);
        var title = "Jugador Eliminado";
        var body = `El jugador ${nombre} a sido eliminado tienes que pagar su couta de ahora en adelante.`;
        await this.notificationService.sendPushNotificationIndividual(transferencia.deudor.jugador,title,body); 
      }  

    }
    

}
