import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns/addMinutes';
import { scheduleJob } from 'node-schedule';
import { Ronda } from 'src/ronda/entities/ronda.entity';
import { Repository } from 'typeorm';
import { Subasta } from './entities/subasta.entity';

@Injectable()
export class SubastaService {
    constructor(
        @InjectRepository( Ronda ) private readonly rondaRepository: Repository<Ronda>,
        @InjectRepository( Subasta ) private readonly subastaRepository: Repository<Subasta>,
    ) {}

    async create(ronda: Ronda){
        var fechaInicio = addMinutes(ronda.fechaInicio, 2);
        var fechaFinal = addMinutes(fechaInicio, 2);
        const subasta = this.subastaRepository.create({
                fechaInicio,
                fechaFinal,
                estado: 'Espera',
                ronda,
            });

        await this.subastaRepository.save(subasta);
    }


    async iniciarSubasta(id: number) {
        const subasta = await this.subastaRepository.findOne({
            where: { id: id },
        }); 
        if ( !subasta ) {
            throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }  

        subasta.estado = 'Iniciada';
        await this.subastaRepository.save(subasta);
        console.log("Subasta Iniciada");

        const fechaFinal = new Date(subasta.fechaFinal);
        //console.log('final' + fechaFinal);

        scheduleJob(fechaFinal, () => {
          this.finalizarSubasta(subasta.id);
        });
    }

    
    async finalizarSubasta(id: number) {
        const subasta = await this.subastaRepository.findOne({
            where: { id: id },
        }); 
        if ( !subasta ) {
            throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }  
        subasta.estado = 'Finalizada';
        await this.subastaRepository.save(subasta);        
        console.log("Subasta finalizada");
    }

}
