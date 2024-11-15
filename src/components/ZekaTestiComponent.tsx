import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ZekaTestiComponent: React.FC = () => {
    const adimlar = [
        [
          "Yazılar, görsellerden daha fazla dikkatimi çeker.",
          "Tarihleri ve isimleri hafızamda tutma konusunda iyiyimdir.",
          "İyi bir okuyucuyum. Kitap okumayı seviyorum.",
          "Telafuz hataları yapmam. Kelimeleri doğru seslendiririm.",
          "Kelime oyunları içeren bilmeceler ilgimi çeker.",
          "Benim için en iyi öğrenme tarzı dinlemektir.",
          "Kelime hazinemin, yaşıtlarıma göre iyi olduğunu düşünüyorum.",
          "Düşüncelerimi yazarak ifade etme konusunda iyiyimdir.",
          "Yeni kelimeler öğrendikçe konuşma ve yazım yaparken bu kelimeleri de kullanırım.",
          "Münazara veya kendiliğinden gelişen sözlü tartışmalarda iyiyimdir.",
        ],
        [
          "Mekanik parçaların, makinelerin çalışma mantığını merak ederim.",
          "Kağıt kalem kullanmadan da aritmetik problemleri çözmeye çalışırım.",
          "Favori derslerim arasında fen ve matematik dersleri hep vardır.",
          "Strateji oyunları daha çok ilgimi çekiyor.",
          "Zihinsel egzersizlerle ilgilenirim. Mantık sorularında iyiyimdir.",
          "PC oyunlarına ilgim var.",
          "Laboratuvar derslerini severim ve kendi kendime de deneyler yaparım.",
          "Soyut kavramlarla aram iyidir. Bu konuda yaşıtlarımdan iyi olabilirim.",
          "Oyunlaştırılmış matematik sorularından hoşlanırım.",
          "Sonuçları tek başına değil; nedenleriyle değerlendirmeyi severim.",
        ],
        [
          "Görsel işaretçileri (harita, tablo vs) daha rahat yorumlarım.",
          "Hayal gücüm iyidir ve sık sık hayal kurarım.",
          "Çizim konusunda iyiyimdir. Güzel resim yaparım.",
          "Şekil veya yapıları bir araya getirip yeni yapılar kurmayı severim. Puzzle oyunu gibi.",
          "Gezip gördüğüm yerler hafızamda kalır.",
          "Şekil ve desen bulmacalarını seviyorum.",
          "Rüyalarımı hatırlarım.",
          "İçeriğinde görsellerin olduğu kitapları daha çok seviyorum.",
          "Defterimin kenarına veya diğer eşyalara küçük resimler karalarım.",
          "Dinlediğim şarkıların ritim ve melodilerini hatırlamakta zorlanmam.",
        ],
        [
          "Şarkı söyleme konusunda iyiyimdir. (Sesim güzel olsa da, olmasa da)",
          "Enstrüman çalmayı biliyorum. (Öğrenmeyi çok istiyorum)",
          "Favori derslerim arasında müzik dersi hep vardır.",
          "Ritmik konuşurum, ritmik hareketler yaparım.",
          "Şarkılar mırıldanmayı çok seviyorum. Bazen hiç farkına varmadan mırıldanıyor olurum.",
          "Ritim tutmayı severim. Bir işle meşgul olurken bile parmaklarımla, ayaklarımla ritim tutarım.",
          "Sesleri birbirinden ayırt ederim. Çevreden gelen seslere karşı duyarlıyımdır.",
          "Müzik eşliğinde çalışmaktan çok keyif alırım.",
          "Şarkılar dinler, şarkılar öğrenir ve bunları paylaşırım.",
          "Hayvanları hem severim, hem de merakla incelerim.",
        ],
        [
          "Doğayı korurum ve duyarsız insanlara karşı tepkiliyim.",
          "Evcil hayvanım var. (veya imkanım olsa ev hayvanı bakmak isterim)",
          "Toprağa, taşa, bitkilere dokunurum.",
          "Bitki ekip, büyütmeyi severim.",
          "Doğanın ve şehirlerin temiz olduğunu görmeye ihtiyaç duyarım.",
          "Hayvan, doğa belgeselleri favorimdir.",
          "İklimsel olaylara ilgiliyimdir. Mevsimler duygularımı etkiler.",
          "Farklı meyvelere, farklı sebzelere çok ilgi duyarım.",
          "Doğadaki mucizelere, doğa olaylarına karşı meraklıyımdır.",
          "Bireysel aktivitelerden ziyade arkadaşlarımla olmayı severim.",
        ],
        [
          "Arkadaşlarım arasında liderlik vasıflarımla ön plana çıkarım.",
          "Arkadaşlarım, tavsiyelerimi önemser. Onlara öğütler veririm.",
          "Çevrem, fikirlerimi beğenir.",
          "Bensiz bir etkinlik düşünülmez. Her yere çağrılırım.",
          "Arkadaşlarımın beni dinlemesinden hoşlandığım için anlatırım.",
          "Arkadaşlarımla daima irtibatta olurum. Onları ararım.",
          "Çevremdekilerin sorunlarıyla ilgilenirim.",
          "Çevremin dikkatini çekerim. Herkes benle arkadaş olmak ister.",
          "Selamlaşmayı, hal-hatır sormayı eksik etmem.",
        ],
        [
          "Yüksek efor gerektiren fiziksel sporlarla ilgilenirim.",
          "Uzun süre sabit durmayı sevmem.",
          "İletişimde beden dilimi iyi kullanırım.",
          "Uygulayarak öğrenmek benim için daha kolaydır.",
          "Cisimlere dokunmayı severim. Elime alır incelerim.",
          "Vaktimi dışarda değerlendirmeyi tercih ederim.",
          "Kağıt oyunlarından ziyade fiziksel hareket gerektiren oyunları tercih ederim.",
          "El işlerinde becerikliyimdir.",
          "Bedensel hareketlerim, duygularımı dışa vurur.",
          "Dokunmanın gücüne inanırım. İnsanların omzuna dokunur, tokalaşır, sarılırım."
        ],
        [
          "Özgürlüğüme düşkünüm.",
          "Hangi konuda iyi olduğumu, hangi konuda zayıf olduğumu bilirim.",
          "Çalışırken yalnız olmayı tercih ederim.",
          "Genel olarak da yalnız kalmaktan keyif alabilirim.",
          "Eserlerimi, işlerimi, yaptıklarımı arkadaşlarımla paylaşırım.",
          "Ne yaptığımı iyi bilirim.",
          "Genellikle akıl danışma gereği duymam.",
          "Saygı benim için çok önemlidir ve kendime olan saygım da yüksektir.",
          "Her zaman daha fazla zaman ayırdığım özel bir ilgi alanım vardır.",
          "Başarmak için çok fazla yardım alma gereği duymam. Başarırım."
        ]
      ];
  const [adim, setAdim] = useState<number>(0);
  const [cevaplar, setCevaplar] = useState<(number | undefined)[]>(Array(adimlar[adim].length).fill(undefined));
  const [puanlar, setPuanlar] = useState<number[]>(Array(adimlar.length).fill(0));
  const navigate = useNavigate();

  const handleCevap = (index: number, deger: number) => {
    const yeniCevaplar = [...cevaplar];
    yeniCevaplar[index] = deger;
    setCevaplar(yeniCevaplar);
  };

  const ileri = () => {
    const currentScore = calculateScore(cevaplar);
    const yeniPuanlar = [...puanlar];
    yeniPuanlar[adim] = currentScore;
    setPuanlar(yeniPuanlar);

    if (adim < adimlar.length - 1) {
      setAdim(adim + 1);
      setCevaplar(Array(adimlar[adim + 1].length).fill(undefined));
    }
  };

  const geri = () => {
    if (adim > 0) {
      setAdim(adim - 1);
      setCevaplar(Array(adimlar[adim - 1].length).fill(undefined));
    }
  };

  const calculateScore = (adimCevaplar: (number | undefined)[]) => {
    return adimCevaplar.reduce((a, b) => a + (b || 0), 0);
  };

  const handleSubmit = async () => {
    const sonuc = {
      "Sözel - Dilsel Zeka": puanlar[0] || 0,
      "Matematiksel - Mantıksal Zeka": puanlar[1] || 0,
      "Görsel - Uzamsal Zeka": puanlar[2] || 0,
      "Müziksel Ritmik Zeka": puanlar[3] || 0,
      "Doğasal Zeka": puanlar[4] || 0,
      "Sosyal Zeka": puanlar[5] || 0,
      "Bedensel - Kinestetik Zeka": puanlar[6] || 0,
      "İçsel Zeka": puanlar[7] || 0
    };

    try {
      await axios.post('http://localhost:5000/api/register', {
        typeofintelligence: JSON.stringify(sonuc)
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Sonuç kaydedilirken bir hata oluştu:", error);
    }
  };

  const allQuestionsAnswered = cevaplar.every((cevap) => cevap !== undefined);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">{adim + 1}. Adım</h1>
      <div className="h-2 bg-gray-300 rounded-full mb-6">
        <div
          className="h-2 bg-orange-500 rounded-full"
          style={{ width: `${((adim + 1) / adimlar.length) * 100}%` }}
        ></div>
      </div>
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr>
            <th className="text-center text-purple-700 py-3">İfadeler</th>
            <th className="text-center text-purple-700 py-3">Kesinlikle katılıyorum</th>
            <th className="text-center text-purple-700 py-3">Biraz katılıyorum</th>
            <th className="text-center text-purple-700 py-3">Emin değilim</th>
            <th className="text-center text-purple-700 py-3">Pek katılmıyorum</th>
            <th className="text-center text-purple-700 py-3">Kesinlikle katılmıyorum</th>
          </tr>
        </thead>
        <tbody>
          {adimlar[adim].map((soru, index) => (
            <tr key={index} className="border-b">
              <td className="text-left px-4 py-3">{soru}</td>
              {[10, 7.5, 5, 2.5, 0].map((deger) => (
                <td key={deger} className="text-center">
                  <input
                    type="radio"
                    name={`soru-${index}`}
                    value={deger}
                    onChange={() => handleCevap(index, deger)}
                    checked={cevaplar[index] === deger}
                    className="scale-125"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button
          onClick={geri}
          disabled={adim === 0}
          className="px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Geri
        </button>
        {adim === adimlar.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`px-4 py-2 font-semibold rounded ${allQuestionsAnswered ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            Kayıt Ol
          </button>
        ) : (
          <button
            onClick={ileri}
            disabled={!allQuestionsAnswered}
            className={`px-4 py-2 font-semibold rounded ${allQuestionsAnswered ? 'bg-purple-700 text-white hover:bg-purple-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            İleri
          </button>
        )}
      </div>
    </div>
  );
};

export default ZekaTestiComponent;
