import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db_hostname'),
        port: parseInt(configService.get('db_port')),
        username: configService.get('db_username'),
        password: configService.get('db_password'),
        database: configService.get('db_database'),
        autoLoadEntities: true,
        // it is unsafe to use synchronize: true for schema synchronization on production
        synchronize: false, // process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        useUTC: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
