import mongoose from 'mongoose';

/**
 * @desc    Deneme sınavı takip şeması
 * @details Kullanıcıların deneme sınavı sonuçlarının veritabanı modeli
 * 
 * @property {ObjectId} user - Sınavı çözen kullanıcının ID'si
 * @property {String} examName - Deneme sınavının adı
 * @property {String} examType - Sınav türü (TYT/AYT)
 * @property {String} aytField - AYT alan türü (Sayısal/Sözel/Eşit Ağırlık/Yabancı Dil)
 * @property {ObjectId} linkedExamId - Bağlantılı sınav ID'si (TYT-AYT eşleşmesi için)
 * @property {Map} subjects - Her ders için doğru/yanlış/boş/net bilgileri
 * @property {Number} totalNet - Toplam net sayısı
 * @property {Number} examScore - Ham puan
 * @property {Number} finalScore - Yerleştirme puanı
 * 
 * @hook pre-save - Net ve puan hesaplamalarını otomatik yapar
 */
const testTrackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  examName: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true,
    enum: ['TYT', 'AYT']
  },
  aytField: {
    type: String,
    enum: ['Sayısal', 'Sözel', 'Eşit Ağırlık', 'Yabancı Dil'],
    required: function() {
      return this.examType === 'AYT';
    }
  },
  linkedExamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestTrack'
  },
  subjects: {
    type: Map,
    of: {
      correct: Number,
      incorrect: Number,
      empty: Number,
      net: Number
    }
  },
  totalNet: Number,
  examScore: Number,
  finalScore: Number
}, {
  timestamps: true
});

// Net ve puan hesaplama middleware'i
testTrackSchema.pre('save', function(next) {
  // Her ders için net hesapla
  let totalNet = 0;
  this.subjects.forEach((value, key) => {
    const net = value.correct - (value.incorrect / 4);
    value.net = parseFloat(net.toFixed(2));
    totalNet += net;
  });
  
  this.totalNet = parseFloat(totalNet.toFixed(2));
  
  // Ham puan hesapla
  if (this.examType === 'TYT') {
    this.examScore = parseFloat((100 + totalNet * 3.3).toFixed(2));
  } else if (this.examType === 'AYT') {
    this.examScore = parseFloat((100 + totalNet * 3).toFixed(2));
  }

  next();
});

const TestTrack = mongoose.model('TestTrack', testTrackSchema);
export default TestTrack; 