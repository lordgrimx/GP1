import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
interface ZekaTestiComponentProps {
  username: string;
  email: string;
  password: string;
  profileImage: string | null;
  onSubmit: (sonuc: any) => void;
}

const ZekaTestiComponent: React.FC<ZekaTestiComponentProps> = ({ username, email, password, profileImage, onSubmit }) => {
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
      
  const { theme } = useTheme();
  const [adim, setAdim] = useState<number>(0);
  const [cevaplar, setCevaplar] = useState<(number | undefined)[]>(Array(adimlar[adim].length).fill(0));
  const [puanlar, setPuanlar] = useState<number[]>(Array(adimlar.length).fill(0));
  const navigate = useNavigate();

  const containerClass = `max-w-3xl mx-auto p-6 rounded-lg ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
  }`;

  const tableClass = `w-full mb-6 border-collapse ${
    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
  }`;

  const headerClass = `text-center py-3 ${
    theme === 'dark' ? 'text-blue-400' : 'text-purple-700'
  }`;

  const rowClass = `border-b ${
    theme === 'dark' ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-50'
  }`;

  const buttonClass = (disabled: boolean) => `
    px-4 py-2 font-semibold rounded transition-colors
    ${disabled 
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
      : theme === 'dark'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-purple-700 text-white hover:bg-purple-800'
    }
  `;

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
      setCevaplar(Array(adimlar[adim + 1].length).fill(0));
    }
  };

  const geri = () => {
    if (adim > 0) {
      setAdim(adim - 1);
      setCevaplar(Array(adimlar[adim - 1].length).fill(0));
    }
  };

  const calculateScore = (adimCevaplar: (number | undefined)[]) => {
    return adimCevaplar.reduce((a, b) => a + (b || 0), 0);
  };

  const handleSubmit = () => {
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
    onSubmit(sonuc);
    navigate('/register');
  };

  const allQuestionsAnswered = cevaplar.every((cevap) => cevap !== undefined);

  return (
    <div className={containerClass}>
      <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-blue-400' : 'text-purple-700'}`}>
        {adim + 1}. Adım
      </h1>
      <div className="h-2 bg-gray-300 rounded-full mb-6">
        <div
          className={`h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-orange-500'}`}
          style={{ width: `${((adim + 1) / adimlar.length) * 100}%` }}
        ></div>
      </div>
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={headerClass}>İfadeler</th>
            <th className={headerClass}>Kesinlikle katılıyorum</th>
            <th className={headerClass}>Biraz katılıyorum</th>
            <th className={headerClass}>Emin değilim</th>
            <th className={headerClass}>Pek katılmıyorum</th>
            <th className={headerClass}>Kesinlikle katılmıyorum</th>
          </tr>
        </thead>
        <tbody>
          {adimlar[adim].map((soru, index) => (
            <tr key={index} className={rowClass}>
              <td className={`text-left px-4 py-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {soru}
              </td>
              {[10, 7.5, 5, 2.5, 0].map((deger) => (
                <td key={deger} className="text-center">
                  <input
                    type="radio"
                    name={`soru-${index}`}
                    value={deger}
                    onChange={() => handleCevap(index, deger)}
                    checked={cevaplar[index] === deger}
                    className={`scale-125 ${theme === 'dark' ? 'accent-blue-500' : 'accent-purple-600'}`}
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
          className={buttonClass(adim === 0)}
        >
          Geri
        </button>
        {adim === adimlar.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={buttonClass(!allQuestionsAnswered)}
          >
            Kayıt Ol
          </button>
        ) : (
          <button
            onClick={ileri}
            disabled={!allQuestionsAnswered}
            className={buttonClass(!allQuestionsAnswered)}
          >
            İleri
          </button>
        )}
      </div>
    </div>
  );
};

export default ZekaTestiComponent;
