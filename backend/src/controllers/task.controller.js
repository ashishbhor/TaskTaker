const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const sort = req.query.sort || "newest";

    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") sortOption = { priority: -1 };

    const total = await Task.countDocuments({ user: req.user.id });

    const tasks = await Task.find({ user: req.user.id })
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    res.json({
        tasks,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
};


exports.updateTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
};
