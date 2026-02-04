const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");

router.use(auth);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);


module.exports = router;