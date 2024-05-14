import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fromZonedTime, toZonedTime   } from 'date-fns-tz';
import { scheduleJob } from 'node-schedule';

import { NotificationService } from 'src/notification/notification.service';
import { RondaService } from 'src/ronda/ronda.service';

import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Partida } from './entities/partida.entity';

import { CreatePartidaDto } from './dto/create-partida.dto';
import { Ronda } from 'src/ronda/entities/ronda.entity';


@Injectable()
export class PartidaService {

    private readonly logger = new Logger('PartidaService') 

    constructor( 
        @InjectRepository( Partida ) private readonly partidaRepository: Repository<Partida>,     
        @InjectRepository( Moneda ) private readonly monedaRepository: Repository<Moneda>, 
        @InjectRepository( Ronda )  private readonly rondaRepository: Repository<Ronda>,
        @Inject(forwardRef(() => RondaService)) private readonly rondaService: RondaService,
        private readonly notificationService: NotificationService,
        ) { }


    async create(createPartidaDto: CreatePartidaDto): Promise<Partida> {
        const moneda = await this.monedaRepository.findOneBy({ id: createPartidaDto.monedaId });
        if (!moneda) {
            throw new NotFoundException('La moneda especificada no existe');
        }
        createPartidaDto.pozo = (createPartidaDto.participantes -1) * createPartidaDto.coutaInicial;
        
        const fechaInicioDate = new Date(createPartidaDto.fechaInicio);
        console.log(fechaInicioDate);
        const zonaUTC = 'Etc/UTC'; // UTC+0
        const fechaEnUTC = toZonedTime(fechaInicioDate, zonaUTC);
        console.log(fechaEnUTC);

        const partida = this.partidaRepository.create({ 
         ...createPartidaDto,      
        fechaInicio: fechaEnUTC,
        moneda
        });
        return await this.partidaRepository.save(partida);
    }


    findAll() {
        return this.partidaRepository.find({});
    }    
    
    
    async findOne(id: number) {
        const partida = await this.partidaRepository.findOne({
            relations: ['rondasEnpartida'],
            where: { id: id },
          });
        if ( !partida ) {
          throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }
        partida.rondasEnpartida.sort((a, b) => a.id - b.id);
        //console.log(partida);
        return partida;
    }


    async remove(id: number) {
        const partida = await this.findOne(id);
        await this.partidaRepository.remove( partida );
    }


    async iniciarPartida(id: number) {
        const partida = await this.partidaRepository.findOne({
            relations: ['participantesEnPartida','participantesEnPartida.jugador'],
            where: { id: id },
          });      
        if ( !partida ) {
            throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }  
        if(partida.participantesEnPartida.length < 2){
            return 'Necesitas mas de 2 participantes' 
        }
        const ahora = new Date();

        partida.participantes = partida.participantesEnPartida.length;
        partida.pozo = ((partida.participantes - 1 ) * partida.coutaInicial);
        partida.fechaInicio = ahora;
        partida.estado = 'Iniciada';

        await this.partidaRepository.save(partida);
        
        var title = "Partida Inciada";
        const body = `La partida ${partida.nombre} ha comenzado.\n La subasta empieza en 2 minutos`;
        await this.notificationService.sendPushNotification(partida.id,title,body);

        const fecha = await this.rondaService.create(partida);
        const fechaFinal = new Date(fecha);
        partida.fechaInicio = fechaFinal;
        await this.partidaRepository.save(partida);

        const jobName = `partidaF-${partida.id}`
            scheduleJob(jobName, fechaFinal, () => {
                this.finalizarPartida(partida.id);
            });

        return await this.findOne(partida.id);
    }
    
    hora() {
        const ahora = new Date();
        console.log('hola ' + ahora);
        return ahora;
    }

    async finalizarPartida(id: number) {
        const partida = await this.partidaRepository.findOne({
            where: { id: id },
            relations: ['rondasEnpartida'],
        }); 
        let rondas = partida.rondasEnpartida;
        for (const ronda of rondas) {
            if (ronda.estado != 'Finalizada') {
                ronda.estado = 'Finalizada';
                await this.rondaRepository.save(ronda);
            }
        }
        partida.estado = 'Finalizada';
        await this.partidaRepository.save(partida);
        var title = "Partida Finalizada";
        const body = `La partida ${partida.nombre} ha finalizado gracias por jugar.`;
        await this.notificationService.sendPushNotification(partida.id,title,body);
    }
}
