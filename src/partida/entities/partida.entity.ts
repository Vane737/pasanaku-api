import { Moneda } from "src/moneda/entities/moneda.entity";
import { Participante } from "src/participante/entities/participante.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Partida {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'text' })
    nombre: string

    @Column({ type: 'integer'})
    pozo: number;
    
    @Column({ type: 'integer'})
    participantes: number;

    @Column({ type: 'integer', default: 0 })
    coutaInicial: number;
    
    @Column({ type: 'timestamp' })
    fechaInicio: Date;

    @Column({ type: 'enum', enum: ['Semanal', 'Bisemanal', 'Mensual'] }) // Lapso de la partida
    lapso: 'Semanal' | 'Bisemanal' | 'Mensual'; 

    @Column({ type: 'enum', enum: ['Espera', 'Iniciada', 'Finalizada'] })
    estado: 'Espera' | 'Iniciada' | 'Finalizada';

    @ManyToOne(() => Moneda, moneda => moneda.partidas, { eager: true })
    moneda: Moneda;
    
    @OneToMany(() => Participante, participante => participante.partida)
    participantesEnPartida: Participante[];

}
