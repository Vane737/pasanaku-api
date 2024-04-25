import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns/addMinutes';
import { scheduleJob } from 'node-schedule';
import { Oferta } from 'src/oferta/entities/oferta.entity';
import { Ronda } from 'src/ronda/entities/ronda.entity';
import { Repository } from 'typeorm';
import { Subasta } from './entities/subasta.entity';

@Injectable()
export class SubastaService {
    constructor(
        @InjectRepository( Ronda ) private readonly rondaRepository: Repository<Ronda>,
        @InjectRepository( Subasta ) private readonly subastaRepository: Repository<Subasta>,
        @InjectRepository( Oferta ) private readonly ofertaRepository: Repository<Oferta>,

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
            relations: ['ofertasDeSubasta','ronda.partida.participantesEnPartida.jugador'],
            where: { id: id },
          });
        if ( !subasta ) {
          throw new NotFoundException(`La ronda con el id ${ id } no fue encontrado.`)
        }
        subasta.estado = 'Finalizada';
        let participanteId;
        
        if (subasta.ofertasDeSubasta.length == 0) {
            console.log("La subasta no tiene ofertas.");
            const opciones = subasta.ronda.partida.participantesEnPartida;
            let elegido;
            for (const opcion of opciones) {
                if (opcion.recibido == false) {
                    elegido = opcion;
                    break;
                }
            }
            subasta.jugadorId = elegido.jugador.id; 
            subasta.ganador = elegido.jugador.nombre; 
            subasta.resultado = 0;
            participanteId = elegido.id;
        } else {
            console.log("La subasta tiene ofertas.");
            const ofertas = subasta.ofertasDeSubasta;
            let ofertaConMayorPuja = ofertas[0];
            for (const oferta of ofertas) {
                if (oferta.puja > ofertaConMayorPuja.puja) {
                    ofertaConMayorPuja = oferta;
                }
            }
            console.log(ofertaConMayorPuja);    
            const oferta = await this.ofertaRepository.findOne({
                relations: ['participante','participante.jugador'],
                where: { id: ofertaConMayorPuja.id },
              });

            subasta.jugadorId = oferta.participante.jugador.id; 
            subasta.ganador = oferta.participante.jugador.nombre; 
            subasta.resultado = oferta.puja;
            participanteId = oferta.participante.id;  
        }
        
        await this.subastaRepository.save(subasta);       
        console.log("Subasta finalizada");
    }

    //Devuelve la subasta
    async findOne(id: number) {
        const subasta = await this.subastaRepository.findOne({
            where: { id: id },
          });
        if ( !subasta ) {
          throw new NotFoundException(`La ronda con el id ${ id } no fue encontrado.`)
        }
        
        /*
        const subasta = await this.subastaRepository.findOne({
            relations: ['ofertasDeSubasta','ronda.partida.participantesEnPartida.jugador'],
            where: { id: id },
          });
        if ( !subasta ) {
          throw new NotFoundException(`La ronda con el id ${ id } no fue encontrado.`)
        }
        subasta.estado = 'Finalizada';
        let participanteId;
        
        if (subasta.ofertasDeSubasta.length == 0) {
            console.log("La subasta no tiene ofertas.");
            const opciones = subasta.ronda.partida.participantesEnPartida;
            let elegido;
            for (const opcion of opciones) {
                if (opcion.recibido == false) {
                    elegido = opcion;
                    break;
                }
            }
            subasta.jugadorId = elegido.jugador.id; 
            subasta.ganador = elegido.jugador.nombre; 
            subasta.resultado = 0;
            participanteId = elegido.id;
        } else {
            console.log("La subasta tiene ofertas.");
            const ofertas = subasta.ofertasDeSubasta;
            let ofertaConMayorPuja = ofertas[0];
            for (const oferta of ofertas) {
                if (oferta.puja > ofertaConMayorPuja.puja) {
                    ofertaConMayorPuja = oferta;
                }
            }
            console.log(ofertaConMayorPuja);    
            const oferta = await this.ofertaRepository.findOne({
                relations: ['participante','participante.jugador'],
                where: { id: ofertaConMayorPuja.id },
              });

            subasta.jugadorId = oferta.participante.jugador.id; 
            subasta.ganador = oferta.participante.jugador.nombre; 
            subasta.resultado = oferta.puja;
            participanteId = oferta.participante.id;  
        }
        console.log(participanteId);
        
        await this.subastaRepository.save(subasta); 
        //ronda.fechaInicio = ronda.fechaInicio.toLocaleString();
        */
        return subasta;
    }
    /*
    findAll() {
        return this.subastaRepository.find({});
    }
    */
}
