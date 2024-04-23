import { Moneda } from "src/moneda/entities/moneda.entity";
import { Oferta } from "src/oferta/entities/oferta.entity";
import { Participante } from "src/participante/entities/participante.entity";
import { Partida } from "src/partida/entities/partida.entity";
import { Ronda } from "src/ronda/entities/ronda.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Subasta {

    @PrimaryGeneratedColumn('increment')
    id: number
    
    @Column({ type: 'timestamp' })
    fechaInicio: Date;

    @Column({ type: 'timestamp' })
    fechaFinal: Date;

    @Column({ type: 'integer', nullable: true})
    jugadorId: number | null;

    @Column({ type: 'text', nullable: true })
    ganador: string | null;

    @Column({ type: 'integer', nullable: true})
    resultado: number | null;

    @Column({ type: 'enum', enum: ['Espera', 'Iniciada', 'Finalizada'] })
    estado: 'Espera' | 'Iniciada' | 'Finalizada';
    
    @OneToOne(() => Ronda, ronda => ronda.subasta)
    @JoinColumn({ name: 'rondaId' })
    ronda: Ronda ;

    @OneToMany(() => Oferta, oferta => oferta.subasta)
    ofertasDeSubasta: Oferta[];
}
