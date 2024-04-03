import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Partida } from 'src/partida/entities/partida.entity';

@Entity()
export class Moneda {

    @PrimaryGeneratedColumn('increment')
    id: string

    @Column({ type: 'text' })
    nombre: string
    
    @OneToMany(() => Partida, partida => partida.moneda)
    partidas: Partida[];

}
