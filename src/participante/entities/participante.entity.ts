
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Partida } from "src/partida/entities/partida.entity";
import { Role } from "src/roles/entities/role.entity";

@Entity()
export class Participante {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'int' })
    cuota: number;

    @Column({ type: 'enum', enum: ['Pago', 'Debe', 'Ganador','Espera'] })
    estado: 'Pago' | 'Debe' | 'Espera' | 'Ganador';

    @Column({ type: 'boolean'})
    recibido: boolean;

    @ManyToOne(() => Partida, partida => partida.participantesEnPartida, { eager: true })
    partida: Partida;

    @ManyToOne(() => Jugador, jugador => jugador.participantesDeJugador, { eager: true })
    jugador: Jugador;

    @ManyToOne(() => Role, rol => rol.participantesRol, { eager: true })
    rol: Role;

    @OneToOne(() => Cuenta, cuenta => cuenta.participante, { eager: true })
    @JoinColumn({name :'cuentaId'})
    cuenta: Cuenta;

}