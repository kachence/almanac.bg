import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register Roboto font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'normal'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    paddingTop: 40,
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 1.4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 1,
  },
  paragraph: {
    fontSize: 11,
    fontFamily: 'Roboto',
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 12,
  },
  article: {
    fontSize: 11,
    fontFamily: 'Roboto',
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  indent: {
    marginLeft: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    paddingTop: 20,
  },
  signatureBox: {
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 150,
    marginTop: 30,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 11,
    fontFamily: 'Roboto',
  },
})

interface DogovorZaNaemTemplateProps {
  formData: {
    landlordName?: string
    landlordEGN?: string
    landlordIDNumber?: string
    landlordIDIssuer?: string
    landlordAddress?: string
    tenantName?: string
    tenantEGN?: string
    tenantIDNumber?: string
    tenantIDIssuer?: string
    tenantAddress?: string
    propertyAddress?: string
    propertyArea?: string
    propertyPurpose?: string
    rentalPeriodMonths?: string
    startDate?: string
    monthlyRent?: string
    paymentDay?: string
    contractDate?: string
    contractCity?: string
  }
}

const DogovorZaNaemTemplate: React.FC<DogovorZaNaemTemplateProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '............................'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  const numberToWords = (num: number): string => {
    const ones = ['', 'един', 'два', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет']
    const tens = ['', 'десет', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет']
    const teens = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет']
    
    if (num < 10) return ones[num]
    if (num >= 10 && num < 20) return teens[num - 10]
    if (num >= 20 && num < 100) {
      const ten = Math.floor(num / 10)
      const one = num % 10
      return tens[ten] + (one > 0 ? ' и ' + ones[one] : '')
    }
    return num.toString()
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ДОГОВОР ЗА НАЕМ НА НЕДВИЖИМ ИМОТ</Text>

        <Text style={styles.paragraph}>
          Днес, {formData.contractDate ? formatDate(formData.contractDate) : '...............................'} г., в {formData.contractCity || '...............................................................'}, между:
        </Text>

        <Text style={styles.paragraph}>
          1. {formData.landlordName || '................................................................................................................'}, 
          ЕГН {formData.landlordEGN || '................................'}, 
          л.к. № {formData.landlordIDNumber || '............................'}, 
          издадена от {formData.landlordIDIssuer || '......................................'}, 
          адрес {formData.landlordAddress || '.........................................................................................................................................'},
        </Text>

        <Text style={styles.paragraph}>
          наричан по-долу Наемодател, от една страна, и
        </Text>

        <Text style={styles.paragraph}>
          2. {formData.tenantName || '................................................................................................................'}, 
          ЕГН {formData.tenantEGN || '................................'}, 
          л.к. № {formData.tenantIDNumber || '............................'}, 
          издадена от {formData.tenantIDIssuer || '......................................'}, 
          адрес {formData.tenantAddress || '.........................................................................................................................................'},
        </Text>

        <Text style={styles.paragraph}>
          наричан по-долу Наемател,
        </Text>

        <Text style={[styles.paragraph, { marginBottom: 20 }]}>
          се сключи настоящият договор за наем.
        </Text>

        <Text style={styles.paragraph}>
          Страните се споразумяха за следното:
        </Text>

        <Text style={styles.sectionTitle}>I.  ПРЕДМЕТ НА ДОГОВОРА И ОБЩИ УСЛОВИЯ</Text>

        <Text style={styles.article}>
          Чл. 1. Наемодателят предоставя на Наемателя за временно ползване срещу възнаграждение недвижим имот с административен 
          адрес: {formData.propertyAddress || '.......................................................................................................................................................................................................................................................................................................................................................................................'}, 
          с площ от {formData.propertyArea || '............................'} кв. м.
        </Text>

        <Text style={styles.article}>
          Чл. 2. Наемният имот ще се ползва за {formData.propertyPurpose || '...................................................................................'}
        </Text>

        <Text style={styles.article}>
          Чл. 3. Договорът се сключва за срок от {formData.rentalPeriodMonths || '.........'}  /{formData.rentalPeriodMonths ? numberToWords(parseInt(formData.rentalPeriodMonths)) : '................................'}/ месеца, 
          считано от {formData.startDate ? formatDate(formData.startDate) : '......................................'}
        </Text>

        <Text style={styles.sectionTitle}>II.  ЦЕНА И ПЛАЩАНЕ</Text>

        <Text style={styles.article}>
          Чл. 4. Месечната наемна цена за ползването на имота е в размер на {formData.monthlyRent || '.........................'} /................................................................./ лв.
        </Text>

        <Text style={styles.article}>
          Чл. 5. Наемателят е длъжен да заплаща наемната цена до {formData.paymentDay || '.....'}-то число на текущия месец.
        </Text>

        <Text style={styles.article}>
          Чл. 6. Наемната цена се плаща в брой, за което Наемодателят съставя разписка.
        </Text>

        <Text style={styles.article}>
          Чл. 7. (1) При сключване на настоящия договор, Наемателят заплаща първата месечна наемна цена и депозит в размер на наемната цена за 1 /един/ месец.
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (2) Депозитът служи обезпечение на евентуални задължения на Наемателя към момента на прекратяване на договора (напр. отговорност за щети, непогасени задължения за месечна наемна цена и т.н.).
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (3) Наемодателят връща на Наемателя депозита или останалата част от него в едноседмичен срок от прекратяването на договора или погасяването на всички задължения на Наемателя, ако е имало такива.
        </Text>

        <Text style={styles.sectionTitle}>III.  ПРАВА И ЗАДЪЛЖЕНИЯ НА НАЕМОДАТЕЛЯ</Text>

        <Text style={styles.article}>
          Чл. 8. (1) Наемодателят се задължава да предаде на Наемателя наемния имот в двудневен срок от подписването на договора, в състояние, което отговаря на предварителния оглед.
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (2) Ако такъв не е бил извършен, наемният имот трябва да бъде предаден в състояние, което позволява безопасно ползване и отговаря на целта, посочена в чл. 2.
        </Text>

        <Text style={styles.article}>
          Чл. 9. Наемодателят се задължава да осигури на Наемателя спокойното и безпрепятствено ползване на наемния имот за срока на договора.
        </Text>

        <Text style={styles.article}>
          Чл. 10. Наемодателят се задължава да извършва всички ремонтни дейности, които не са за сметка на Наемателя, в разумен срок и по начин, който най-малко възпрепятства ползването на имота.
        </Text>

        <Text style={styles.article}>
          Чл. 11. Наемодателят се задължава да получи обратно наемния имот в тридневен срок от прекратяването на настоящия договор.
        </Text>

        <Text style={styles.sectionTitle}>IV.  ПРАВА И ЗАДЪЛЖЕНИЯ НА НАЕМАТЕЛЯ</Text>

        <Text style={styles.article}>
          Чл. 12. Наемателят се задължава да плаща наемната цена в размера, срока и начина, уговорени в настоящия договор.
        </Text>

        <Text style={styles.article}>
          Чл. 13. (1) Наемателят се задължава да плаща в съответния срок всички сметки за комунални услуги (напр. електричество, водоснабдяване, топлоподаване, интернет достъп, телефон, ТВ абонамент и подобни, включително и сметки за общите части) и такси от всякакво естество (напр. поддръжка на общи части).
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (2) Наемателят е длъжен да пази доказателствата за извършените плащания и при поискване да ги предоставя на Наемодателя.
        </Text>

        <Text style={styles.article}>
          Чл. 14. (1) Наемателят е длъжен да ползва имота само по предназначението, посочено в чл. 2.
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (2) Наемателят няма право да преотдава имота или части от него под наем.
        </Text>

        <Text style={[styles.article, styles.indent]}>
          (3) Наемателят няма право да извършва промени, преустройства или основни ремонти в имота без изричното съгласие на Наемодателя.
        </Text>

        <Text style={styles.article}>
          Чл. 15. Наемателят се задължава да се грижи за наемния имот с грижата на добрия стопанин, да спазва стриктно всички законови и технически изисквания за правилната му експлоатация, както и всички правила за пожарна безопасност, правила, установени в етажната собственост, и задължения, посочени в застрахователната полица на имота.
        </Text>

        <Text style={styles.article}>
          Чл. 16. Разходите за текущи ремонти и поддръжка на наемния имот са за сметка на Наемателя.
        </Text>

        <Text style={styles.article}>
          Чл. 17. Наемателят се задължава да върне наемния имот в състоянието, в което му е предаден, като се отчете нормалното остаряване и изхабяване, в тридневен срок от прекратяването на договора.
        </Text>

        <Text style={styles.article}>
          Чл. 18. Наемателят се задължава незабавно да уведомява Наемодателя за всички посегателства и повреди, които са засегнали наемния имот, независимо от естеството, причината или източника.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>V.  ОБЕЗПЕЧЕНИЕ И ОТГОВОРНОСТ</Text>

        <Text style={styles.article}>
          Чл. 19. В случай на забава на която и да е от страните, неизправната страна дължи неустойка в размер на 0,5% от стойността на наемната сума за всеки ден забава, но не повече от 100%.
        </Text>

        <Text style={styles.article}>
          Чл. 20. Ако наемният имот е върнат в състояние, което не отговаря на условията на настоящия договор, Наемателят дължи обезщетение в размер, установен чрез договорка между страните или от вещо лице, посочено от застрахователя на наемния имот.
        </Text>

        <Text style={styles.sectionTitle}>VI.  ПРЕКРАТЯВАНЕ НА ДОГОВОРА</Text>

        <Text style={styles.article}>
          Чл. 21. Договорът се прекратява:
        </Text>

        <Text style={[styles.article, { marginLeft: 10 }]}>
          1. по взаимно съгласие между страните
        </Text>

        <Text style={[styles.article, { marginLeft: 10 }]}>
          2. с изтичането на срока на договора
        </Text>

        <Text style={[styles.article, { marginLeft: 10 }]}>
          3. преди изтичането на срока на договора, с едномесечно писмено предизвестие
        </Text>

        <Text style={[styles.article, { marginLeft: 10 }]}>
          4. от изправната страна, при неизпълнение от договора, със седемдневно писмено предизвестие.
        </Text>

        <Text style={styles.article}>
          Чл. 22. Ако след изтичането на срока на договора, Наемателят продължи да ползва наемния имот със знанието на Наемодателя и без неговото противопоставяне, договорът остава в сила между страните като безсрочен договор за наем.
        </Text>

        <Text style={styles.sectionTitle}>VII. ДРУГИ РАЗПОРЕДБИ</Text>

        <Text style={styles.article}>
          Чл. 23. Наемният имот ще бъде предаден на Наемателя (при сключването на договора), а след това обратно на Наемодателя (при прекратяването му) с подписването на приемо-предавателен протокол.
        </Text>

        <Text style={styles.article}>
          Чл. 24. Настоящият договор може да бъде изменян само писмено.
        </Text>

        <Text style={styles.article}>
          Чл. 25. За неуредените въпроси се прилага законодателството на Република България.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 20, marginBottom: 30 }]}>
          Настоящият договор се състави в два екземпляра, по един за всяка от страните.
        </Text>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>/Наемодател/</Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>/Наемател/</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default DogovorZaNaemTemplate
