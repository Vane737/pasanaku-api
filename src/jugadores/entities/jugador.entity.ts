import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Participante } from "src/participante/entities/participante.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Jugador {

    @PrimaryGeneratedColumn('increment')
    id: string

    @Column('text')
    nombre: string

    @Column('text', {
        unique: true,
    })
    ci: string

    @Column('text', {
        unique: true,
    })
    telefono: string

    @Column('text')
    direccion: string
    
    @Column('text', {
        unique: true,
    })
    email: string

    @Column('text')
    contraseñaHash: string
    
    

    @OneToMany( 
        () => Cuenta,
        (cuenta) => cuenta.jugador, 
        { cascade: true, eager: true } )
    cuentas : Cuenta[];

    
    @OneToMany(() => Participante, participante => participante.jugador)
    participantesDeJugador: Participante[];

}
