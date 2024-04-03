import { Banco } from "src/banco/entities/banco.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cuenta {

    @PrimaryGeneratedColumn('increment')
    id: number

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

    // Relación Muchos a Uno: muchas cuentas pertenecen a un solo banco
    @ManyToOne(() => Banco, banco => banco.cuentas, { eager:true })
    banco: Banco;
}
