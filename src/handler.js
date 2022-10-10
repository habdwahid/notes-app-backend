const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (req, h) => {
    const id = nanoid(16);
    const { title, tags, body } = req.payload;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id,
        title,
        tags,
        body,
        createdAt,
        updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const res = h.response({
            status: "success",
            message: "Catatan berhasil ditambahkan",
            data: {
                noteId: id,
            },
        });

        res.code(201);
        return res;
    }

    const res = h.response({
        status: "failed",
        message: "Catatan gagal ditambahkan",
    });

    res.code(500);
    return res;
};

const getAllNotesHandler = () => ({
    status: "success",
    data: {
        notes,
    },
});

const getNoteByIdHandler = (req, h) => {
    const { id } = req.params;
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: "success",
            data: {
                note,
            },
        };
    }

    const res = h.response({
        status: "failed",
        message: "Catatan tidak ditemukan",
    });
    res.code(404);
    return res;
};

const editNoteByIdHandler = (req, h) => {
    const { id } = req.params;
    const { title, tags, body } = req.payload;
    const updatedAt = new Date().toISOString();

    const i = notes.findIndex((note) => note.id === id);

    if (i !== -1) {
        notes[i] = {
            ...notes[i],
            title,
            body,
            tags,
            updatedAt,
        };

        const res = h.response({
            status: "success",
            message: "Catatan berhasil diperbarui",
        });

        res.code(200);
        return res;
    }

    const res = h.response({
        status: "failed",
        message: "Catatan gagal diperbarui",
    });

    res.code(404);
    return res;
};

const deleteNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const i = notes.findIndex((note) => note.id === id);

    if (i !== -1) {
        notes.splice(i, 1);

        const res = h.response({
            status: "success",
            message: "Catatan berhasil dihapus",
        });

        res.code(200);
        return res;
    }

    const res = h.response({
        status: "failed",
        message: "Gagal menghapus, catatan tidak ditemukan",
    });

    res.code(404);
    return res;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
