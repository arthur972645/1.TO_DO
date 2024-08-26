import conn from "../config/conn.js";
import { DataTypes } from "sequelize";

const Tarefa = conn.define("tarefas", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
});
