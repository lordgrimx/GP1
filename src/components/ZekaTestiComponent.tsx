/**
 * @fileoverview Çoklu zeka testi bileşeni - Kullanıcının zeka türünü belirlemek için test sunar
 * @module Components/ZekaTestiComponent
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import showToast from '../utils/toast';
interface ZekaTestiComponentProps {
  username: string;
  email: string;
  password: string;
  profileImage: string | null;
  onSubmit: (sonuc: any) => void;
}

/**
 * Zeka Testi Bileşeni Props Arayüzü
 * @interface
 * @typedef {Object} ZekaTestiComponentProps
 * @property {string} username - Kullanıcı adı
 * @property {string} email - Kullanıcı email adresi
 * @property {string} password - Kullanıcı şifresi
 * @property {string|null} profileImage - Kullanıcı profil fotoğrafı
 * @property {(sonuc: any) => void} onSubmit - Test sonuçlarını işleyen callback fonksiyonu
 */

/**
 * Çoklu zeka testi bileşeni
 * @component
 * @param {ZekaTestiComponentProps} props - Bileşen özellikleri
 * @returns {JSX.Element} Zeka testi formu
 * 
 * @example
 * // Bileşenin kullanımı:
 * <ZekaTestiComponent
 *   username="test_user"
 *   email="test@example.com"
 *   password="******"
 *   profileImage={null}
 *   onSubmit={(sonuc) => console.log('Test sonucu:', sonuc)}
 * />
 */
const ZekaTestiComponent: React.FC<ZekaTestiComponentProps> = ({
  username,
  email,
  password,
  profileImage,
  onSubmit
}) => {
  /**
   * Test adımlarını içeren array
   * @type {string[][]}
   */
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

  /**
   * Tema context'inden tema bilgisini al
   */
  const { theme } = useTheme();

  /**
   * Mevcut adım state'i
   * @type {[number, function]} useState hook
   */
  const [adim, setAdim] = useState<number>(0);

  /**
   * Kullanıcı cevapları state'i
   * @type {[(number|undefined)[], function]} useState hook
   */
  const [cevaplar, setCevaplar] = useState<(number | undefined)[]>(
    Array(adimlar[adim].length).fill(0)
  );

  /**
   * Puanları tutan state'i
   * @type {number[]} useState hook
   */
  const [puanlar, setPuanlar] = useState<number[]>(Array(adimlar.length).fill(0));

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /**
   * Cevap seçme işleyicisi
   * @param {number} index - Soru indeksi
   * @param {number} deger - Seçilen cevap değeri
   */
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const sonuc = {
        username,
        email,
        password,
        profileImage,
        typeofintelligence: {
          "Sözel - Dilsel Zeka": Number(puanlar[0]) || 0,
          "Matematiksel - Mantıksal Zeka": Number(puanlar[1]) || 0,
          "Görsel - Uzamsal Zeka": Number(puanlar[2]) || 0,
          "Müziksel Ritmik Zeka": Number(puanlar[3]) || 0,
          "Doğasal Zeka": Number(puanlar[4]) || 0,
          "Sosyal Zeka": Number(puanlar[5]) || 0,
          "Bedensel - Kinestetik Zeka": Number(puanlar[6]) || 0,
          "İçsel Zeka": Number(puanlar[7]) || 0
        }
      };

      await onSubmit(sonuc);
      showToast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
      
    } catch (error: any) {
      console.error('Test sonucu gönderme hatası:', error);
      showToast.error(
        error.response?.data?.message || 
        'Sonuçlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const allQuestionsAnswered = cevaplar.every((cevap) => cevap !== undefined);

  return (
    <div className={`w-full max-w-7xl mx-auto p-8 ${
      theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
    }`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{adim + 1}. ADIM</h2>
        <div className="flex gap-1 w-full">
          {Array.from({ length: adimlar.length }).map((_, idx) => (
            <div
              key={idx}
              className={`
                h-2 flex-1 rounded-full transition-all duration-300
                ${idx === adim 
                  ? 'bg-orange-500' 
                  : idx < adim 
                    ? 'bg-orange-500' 
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Questions Table */}
      <table className={`w-full border-collapse ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
      }`}>
        <thead>
          <tr className={`border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <th className={`text-left py-4 w-1/3 font-semibold ${
              theme === 'dark' ? 'text-blue-400' : 'text-purple-800'
            }`}>İfadeler</th>
            {['Kesinlikle katılıyorum', 'Biraz katılıyorum', 'Emin değilim', 
              'Pek katılmıyorum', 'Kesinlikle katılmıyorum'].map(baslik => (
              <th key={baslik} className={`text-center py-4 font-semibold ${
                theme === 'dark' ? 'text-blue-400' : 'text-purple-800'
              }`}>
                {baslik}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {adimlar[adim].map((soru, index) => (
            <tr key={index} className={`border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <td className={`py-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{soru}</td>
              {[10, 7.5, 5, 2.5, 0].map((deger) => (
                <td key={deger} className="text-center py-4">
                  <label className="inline-block cursor-pointer">
                    <input
                      type="radio"
                      name={`soru-${index}`}
                      value={deger}
                      checked={cevaplar[index] === deger}
                      onChange={() => handleCevap(index, deger)}
                      className={`w-4 h-4 border-2 rounded-full cursor-pointer
                        ${theme === 'dark'
                          ? 'border-gray-600 checked:border-blue-500 checked:bg-blue-500'
                          : 'border-gray-300 checked:border-purple-500 checked:bg-purple-500'
                        }
                        focus:ring-2 ${
                          theme === 'dark'
                            ? 'focus:ring-blue-400/20'
                            : 'focus:ring-purple-200'
                        }
                      `}
                    />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Navigation */}
      <div className="flex justify-end gap-4 mt-6">
        {adim > 0 && (
          <button
            onClick={geri}
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Geri
          </button>
        )}

        {adim === adimlar.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading || !allQuestionsAnswered}
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              loading || !allQuestionsAnswered
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {loading ? 'Kaydediliyor...' : 'Testi Tamamla'}
          </button>
        ) : (
          <button
            onClick={ileri}
            disabled={!allQuestionsAnswered}
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              !allQuestionsAnswered
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            İleri
          </button>
        )}
      </div>
    </div>
  );
};

export default ZekaTestiComponent;
