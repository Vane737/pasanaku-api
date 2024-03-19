import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Jugador {

    @PrimaryGeneratedColumn('increment')
    id: string

    @Column('text', {
        unique: true,
    })
    nombre: string

    @Column('text')
    telefono: string

    @Column('text')
    ci: string

    @Column('text')
    email: string
    
    @Column('text')
    direccion: string

    @OneToMany( 
        () => Cuenta,
        (cuenta) => cuenta.jugador, 
        { cascade: true, eager: true } )
    cuentas : Cuenta[];
}
