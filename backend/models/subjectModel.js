import mongoose from 'mongoose';

/**
 * @desc    Ders şeması
 * @details Sistemdeki derslerin ve konuların veritabanı modeli
 * 
 * @property {String} Lesson - Ders adı
 * @property {Number} questionNumber - Derse ait soru sayısı
 * @property {Map<String>} subjects - Derse ait konular listesi
 * @property {Map<Number>} proficiencyLevels - Her konu için yeterlilik seviyesi
 * @property {Date} createdAt - Oluşturulma tarihi (timestamps)
 * @property {Date} updatedAt - Güncellenme tarihi (timestamps)
 */
const subjectSchema = new mongoose.Schema({
  Lesson: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  subjects: {
    type: Map,
    of: String
  },
  proficiencyLevels: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;