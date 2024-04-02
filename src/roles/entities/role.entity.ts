import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {

    @PrimaryGeneratedColumn('increment')
    id: string

    @Column('text',{
        unique: true,
    })
    nombre: string;

}
