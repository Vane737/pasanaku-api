import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cuenta {

    @PrimaryGeneratedColumn('increment')
    id: string

    @Column('text', {
        unique: true,
    })
    nro: string

    @Column('text')
    departamento: string

    @ManyToOne( 
        () => Jugador,
        ( jugador ) => jugador.cuentas,
        { onDelete: 'CASCADE'}
    )
    jugador: string;


}
