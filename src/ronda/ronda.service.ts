import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { addWeeks } from 'date-fns';
import { addMonths } from 'date-fns/addMonths';
import { scheduleJob } from 'node-schedule';
import { fromZonedTime   } from 'date-fns-tz';


import { LessThan, Repository } from 'typeorm';
import { Partida } from 'src/partida/entities/partida.entity';
import { Ronda } from './entities/ronda.entity';
import { SubastaService } from 'src/subasta/subasta.service';


@Injectable()
export class RondaService {

    constructor(
        @InjectRepository( Partida ) private readonly partidaRepository: Repository<Partida>,
        @InjectRepository( Ronda ) private readonly rondaRepository: Repository<Ronda>,
        private readonly subastaService: SubastaService,
    ) {}

    async create(partida: Partida){
        var fechaInicio = partida.fechaInicio;
        var lapso = partida.lapso;
        
        for (let index = 0; index < partida.participantes; index++) {
          const ronda = this.rondaRepository.create({
              nombre: `Ronda ${index + 1}`, 
              fechaInicio,
              estado: 'Espera',
              partida,
          });
          await this.rondaRepository.save(ronda);
          fechaInicio = this.calcularFechaSiguiente(fechaInicio,lapso);
          await this.subastaService.create(ronda);

          if(index == 0){
            var id = ronda.id;
          }

        }
        await this.iniciarRonda(id);
    }


    private calcularFechaSiguiente(fechaInicio: Date, lapso: string): Date {
        switch (lapso) {
          case 'Semanal':
            return addWeeks(fechaInicio, 1);
          case 'Bisemanal':
            return addWeeks(fechaInicio, 2);
          case 'Mensual':
            return addMonths(fechaInicio, 1);
          default:
            throw new Error(`Lapso desconocido: ${lapso}`);
        }
    }


    async iniciarRonda(id: number) {
      const ronda = await this.rondaRepository.findOne({
          relations: ['subasta'],
          where: { id: id },
      }); 
      if ( !ronda ) {
          throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
      }  

      const partida = ronda.partida;
      const rondaAnterior = await this.rondaRepository.findOne({
        where: { partida: partida, fechaInicio: LessThan(ronda.fechaInicio) },
        order: { fechaInicio: 'DESC' },
      });
      if (rondaAnterior && rondaAnterior.estado !== 'Finalizada') {
        rondaAnterior.estado = 'Finalizada';
        await this.rondaRepository.save(rondaAnterior);
        console.log(`Ronda anterior con ID ${rondaAnterior.id} ha sido finalizada.`);
      }
    
      ronda.estado = 'Iniciada';
      await this.rondaRepository.save(ronda);

      if (ronda.subasta && ronda.subasta.fechaInicio) {
        var fechaInicioSubasta = new Date(ronda.subasta.fechaInicio);
        //fechaInicioSubasta =  fromZonedTime(fechaInicioSubasta, 'America/La_Paz')
        scheduleJob(fechaInicioSubasta, () => {
          this.subastaService.iniciarSubasta(ronda.subasta.id);
        });
  
        console.log('Subasta programada para iniciar el '+ fechaInicioSubasta);
      }
  }
}
