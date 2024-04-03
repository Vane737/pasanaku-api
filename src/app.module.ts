import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JugadoresModule } from './jugadores/jugadores.module';
import { BancoModule } from './banco/banco.module';
import { CuentaModule } from './cuenta/cuenta.module';


console.log(process.env.DB_HOST)
console.log(process.env.DB_USERNAME)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // Carga automaticamente las entidades
      synchronize: true,  // Realiza las migraciones automaticamente
    }),
    JugadoresModule,
    BancoModule,
    CuentaModule,
  ]
})
export class AppModule {}
