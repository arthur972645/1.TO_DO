import Tarefa from "../models/tarefaModel.js";

//*tarefas?page=1&limit=10
export const getAll = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const tarefas = await Tarefa.findAndCountAll({
      limit,
      offset,
    });

    const totalPaginas = Math.ceil(tarefas.count / limit);
    response.status(200).json({
      totalTarefas: tarefas.count,
      totalPaginas,
      paginaAtual: page,
      itemsPorPagina: limit,
      proximaPagina:
        totalPaginas === 0
          ? null
          : `http://localhost:3333/tarefas?page=${page + 1}`,
      tarefas: tarefas.rows,
    });
  } catch (error) {
    response.status(500).json({ message: "erro ao buscar tarefas" });
  }
};

//*precisa de validação
export const create = async (request, response) => {
  const { tarefa, descricao } = request.body;
  const status = "pendente";

  if (!tarefa) {
    response.status(400).json({ err: "a tarefa é obrigatória" });
    return;
  }
  if (!descricao) {
    response.status(400).json({ err: "a descricao é obrigatória" });
    return;
  }

  const novaTarefa = {
    tarefa,
    descricao,
    status,
  };
  try {
    await Tarefa.create(novaTarefa);
    response.status(201).json({ message: "tarefa cadastrada" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "erro ao cadastrar tarefa" });
  }
};
//*precisa de validação
export const getTarefa = async (request, response) => {
  const { id } = request.params;
  try {
    // const tarefa = await Tarefa.findByPk(id);
    // OBJETO;
    const tarefa = await Tarefa.findOne({ where: { id } });
    if (tarefa === null) {
      response.status(404).json({ message: "tarefa não encontrada" });
      return;
    }
    response.status(200).json(tarefa);
  } catch (error) {
    response.status(500).json({ message: "erro ao buscar tarefa" });
  }
};
//*precisa de validação
export const updateTarefa = async (request, response) => {
  const { id } = request.params;
  const { tarefa, descricao, status } = request.body;

  //*validações
  if (!tarefa) {
    response.status(400).json({ message: "a tarefa é obrigatória" });
    return;
  }
  if (!descricao) {
    response.status(400).json({ message: "a descricao é obrigatória" });
    return;
  }
  if (!status) {
    response.status(400).json({ message: "o status é obrigatória" });
    return;
  }
  const tarefaAtualizada = {
    tarefa,
    descricao,
    status,
  };
  try {
    const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, {
      where: { id },
    });
    if (linhasAfetadas <= 0) {
      response.status(404).json({ message: "tarefa não encontrada" });
      return;
    }

    response.status(200).json({ message: "tarefa atualiza" });
  } catch (error) {
    response.status(200).json({ message: "erro ao atualizar tarefa" });
  }
};
//*precisa de validação
export const updateStatusTarefa = async (request, response) => {
  const { id } = request.params;
  try {
    const tarefa = await Tarefa.findOne({ raw: true, where: { id } });
    if (tarefa === null) {
      response.status(404).json({ message: "tarefa não encontrada" });
      return;
    }
    if (tarefa.status === "pendente") {
      await Tarefa.update({ status: "concluida" }, { where: { id: id } });
    } else if (tarefa.status === "concluida") {
      await Tarefa.update({ status: "pendente" }, { where: { id: id } });
      //*
    }
    const tarefaAtualizada = await Tarefa.findOne({ raw: true, where: { id } });
    response.status(200).json(tarefaAtualizada);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "erro ao atualizar tarefa" });
  }
};
//*precisa de validação
export const getTarefaPorSituacao = async (request, response) => {
  const { situacao } = request.params;
  if (situacao !== "pendente" && situacao !== "concluida") {
    response
      .status(400)
      .json({ message: "Situação inválida. Use 'pendente' ou 'concluida'" });
    return;
  }
  try {
    const tarefas = await Tarefa.findAll({
      where: { status: situacao },
      raw: true,
    });
    response.status(200).json(tarefas)
  } catch (error) {
    response.status(500).json({err: "erro ao buscar tarefas"})
  }
};
