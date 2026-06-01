import createHttpError from 'http-errors';

import { Note } from '../models/note.js';
import { TAGS } from '../constants/tags.js';

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOne({
    _id: noteId,
    userId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const userId = req.user._id;

  const skip = (page - 1) * perPage;

  const query = Note.find({ userId });

  if (search) {
    query.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (tag) {
    if (!TAGS.includes(tag)) {
      throw createHttpError(400, 'Invalid tag');
    }

    query.where('tag').equals(tag);
  }

  const [totalNotes, notes] = await Promise.all([
    query.clone().countDocuments(),
    query.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const createNote = async (req, res) => {
  const userId = req.user._id;

  const note = await Note.create({
    ...req.body,
    userId,
  });

  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
