import { Moneda } from "src/moneda/entities/moneda.entity";
import { Participante } from "src/participante/entities/participante.entity";
import { Partida } from "src/partida/entities/partida.entity";
import { Subasta } from "src/subasta/entities/subasta.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Ronda {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'text' })
    nombre: string
    
    @Column({ type: 'timestamp' })
    fechaInicio: Date;

    @Column({ type: 'enum', enum: ['Espera', 'Iniciada', 'Finalizada'] })
    estado: 'Espera' | 'Iniciada' | 'Finalizada';

    @ManyToOne(() => Partida, partida => partida.rondasEnpartida)
    partida: Partida;
    
    @OneToOne(() => Subasta, subasta => subasta.ronda)
    subasta: Subasta;

}
