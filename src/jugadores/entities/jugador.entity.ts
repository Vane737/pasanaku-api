import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Invitacion } from "src/invitacion/entities/invitacion.entity";
import { Participante } from "src/participante/entities/participante.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Jugador {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string

    @Column('text', {
        unique: true
    })
    @Column('text')
    telefono: string

    @Column('text', {
        unique: true
    })
    ci: string

    @Column('text', {
        unique: true
    })
    email: string
    
    @Column('text')
    direccion: string

    @Column('text', {select: false})
    password:  string;

    @OneToMany( 
        () => Cuenta,
        (cuenta) => cuenta.jugador, 
        { cascade: true, eager: true } )
    cuentas : Cuenta[];

    @OneToMany(() => Participante, participante => participante.jugador,{ cascade: true, eager: true })
    participantesDeJugador: Participante[];

    @OneToMany(() => Invitacion, invitacion => invitacion.jugador,{ cascade: true})
    invitacionesDeJugador: Invitacion[];    
}
