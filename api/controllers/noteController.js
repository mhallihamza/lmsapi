const Note = require('../models/Note');

// get notes by teacher id
exports.getNotesByInstructor = (req, res) => {
    const instructorId = req.params.id;
    const cls = req.params.class;
    const exam = req.params.exam;
    Note.find({ instructor: instructorId , class : cls , exam : exam})
      .populate('exam', 'subject') // include exam name
      .populate('student', 'username image') // include student's name
      .populate('class','name')
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Fetching notes failed!' });
      });
  };

// get notes by student id
exports.getNotesByStudent = (req, res) => {
    const studentId = req.params.studentId;
    Note.find({ student: studentId })
      .populate('exam', 'subject') // include exam name
      .populate('instructor', 'username') // include instructor's name
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Fetching notes failed!' });
      });
  };

// create a new notes
exports.createNote = (req, res) => {
   const notes = req.body;
   Note.insertMany(notes)
      .then(createdNote => {
        res.status(201).json(createdNote);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Creating a note failed!' });
      });
  };

// update an existing note
exports.updateNote = (req, res, next) => {
    const notesToUpdate = req.body;
    const bulkOps = notesToUpdate.map(note => ({
      updateOne: {
        filter: { exam: note.exam, class: note.class, instructor: note.instructor, student: note.student },
        update: { note: note.note }
      }
    }));
    Note.bulkWrite(bulkOps)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Couldn\'t update note!' });
      });
  };

  exports.getNotes = (req, res) => {
    const cls = req.params.class;
    const exam = req.params.exam;
    Note.find({class : cls , exam : exam})
      .populate('exam', 'subject') // include exam name
      .populate('student', 'username image') // include student's name
      .populate('class','name')
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Fetching notes failed!' });
      });
  };
