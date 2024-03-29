import {Entity, Column, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn} from "typeorm";
/* istanbul ignore file */
@Entity({name:"<%=entityNameSnake%>"})
export class <%=entityClassName%> {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name:string
    @CreateDateColumn()
    created:Date
    @UpdateDateColumn()
    updated:Date
}