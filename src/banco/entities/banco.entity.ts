import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Banco {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text', {
        unique: true,
    })
    nombre: string

      // Relación Uno a Muchos: un banco puede tener muchas cuentas
    @OneToMany(() => Cuenta, cuenta => cuenta.banco, 
    { cascade: true })
    cuentas: Cuenta[];

}
