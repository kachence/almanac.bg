import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register Roboto font with proper bold variant
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
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  toField: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  underline: {
    minWidth: 200,
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 4,
  },
  fromSection: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  content: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  paragraph: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  relationshipSection: {
    marginVertical: 10,
    textAlign: 'center',
  },
  relationshipText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerField: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  signatureLine: {
    minWidth: 150,
    marginLeft: 5,
  },
})

interface ZayavlenieZaOtsastvieTemplateProps {
  formData: {
    schoolName?: string
    schoolLocation?: string
    studentClass?: string
    parentName?: string
    parentAddress?: string
    studentName?: string
    absenceFromDate?: string
    absenceToDate?: string
    absenceReason?: string
    submissionDate?: string
  }
}

const ZayavlenieZaOtsastvieTemplate: React.FC<ZayavlenieZaOtsastvieTemplateProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '........................'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  const calculateDays = () => {
    if (!formData.absenceFromDate || !formData.absenceToDate) return ''
    
    const fromDate = new Date(formData.absenceFromDate)
    const toDate = new Date(formData.absenceToDate)
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    return diffDays.toString()
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Empty space for left alignment */}
          </View>
          <View style={styles.headerRight}>
            <View style={styles.toField}>
              <Text style={styles.label}>ДО КЛАСНИЯ РЪКОВОДИТЕЛ</Text>
            </View>
            <View style={[styles.toField, { justifyContent: 'flex-end' }]}>
              <Text style={styles.label}>НА </Text>
              <Text style={[styles.underline, { minWidth: 30, maxWidth: 30 }]}>{formData.studentClass || '.......'}</Text>
              <Text style={styles.label}> КЛАС</Text>
            </View>
            <View style={styles.toField}>
              <Text style={styles.label}>В</Text>
              <Text style={styles.underline}>{formData.schoolName || '........................................................'}</Text>
            </View>
            <View style={styles.toField}>
              <Text style={styles.underline}>{formData.schoolLocation || '........................................................'}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>З А Я В Л Е Н И Е</Text>

        {/* From Section */}
        <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: 30}}>
          <Text style={styles.label}>от</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '85%' }]}>{formData.parentName || '..................................................................................................................................................'}</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.label, { textAlign: 'center', fontStyle: 'italic' }]}>/име, презиме, фамилия на родител/настойник/</Text>
        </View>

        <View style={[styles.fromSection, { marginTop: 10 }]}>
          <Text style={styles.label}>адрес и тел. за контакт:</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '75%' }]}>{formData.parentAddress || '................................................................................................'}</Text>
        </View>

        {/* Subject Line */}
        <View style={[styles.fromSection, { marginTop: 10, marginBottom: 10 }]}>
          <Text style={styles.label}>Относно:</Text>
          <Text style={styles.label}> Отсъствия по уважителни причини </Text>
          <Text style={styles.label}>до </Text>
          <Text style={styles.label}>15 дни</Text>
          <Text style={styles.label}> в една учебна година.</Text>
        </View>

        {/* Legal basis */}
        <View style={styles.paragraph}>
          <Text style={[styles.label, { fontSize: 11, fontStyle: 'italic' }]}>
            Съгласно наредбата за приобщаващото образование чл. 62 ал. 1, т. 3. (изм. - ДВ, бр. 23 от 2024 г., в сила от 19.03.2024 г.),
            ученикът може да отсъства от училище по уважителни причини до 15 дни в една учебна година с мотивирано заявление от
            родител до класния ръководител, {' '}
            <Text style={{ fontWeight: 'bold' }}>но не повече от 5 дни наведнъж</Text>.
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.relationshipSection}>
          <Text style={styles.relationshipText}>
            УВАЖАЕМА ГОСПОЖО/УВАЖАЕМИ ГОСПОДИН{formData.parentName ? ',' : '.....................................................,'}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Моля да разрешите отсъствието на сина /дъщеря/ ми{' '}
            {formData.studentName || '................................................................................................,'}
          </Text>

          <Text style={styles.paragraph}>
            ученик/ученичка от{formData.studentClass ? `..........${formData.studentClass}` : '..........'} клас да бъде освободен/а от учебните занятия за{' '}
            {calculateDays() || '...........'} дни
          </Text>

          <Text style={styles.paragraph}>
            от {formData.absenceFromDate ? formatDate(formData.absenceFromDate) : '................................'} до{' '}
            {formData.absenceToDate ? formatDate(formData.absenceToDate) : '................................'}, включително.
          </Text>

          <View style={[styles.fromSection, { marginTop: 15, marginBottom: 0 }]}>
            <Text style={styles.label}>Отсъствията се налагат поради</Text>
            <Text style={[styles.underline, { flex: 1, maxWidth: '60%' }]}>
              {formData.absenceReason || '...............................................................................................'}
            </Text>
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label, { textAlign: 'right', fontStyle: 'italic', marginRight: 10 }]}>/описват се причините, които налагат отсъствието/</Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 15 }]}>
            Декларирам, че по време на отсъствие от учебни занятия детето ми самостоятелно ще
            усвои пропуснатото учебно съдържание.
          </Text>

          <Text style={styles.paragraph}>
            Налагам се да счетете изложените причини за основателни и да разрешите отсъствието. В
            случай на отказ моля да бъда уведомен/а своевременно.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Дата:</Text>
              <Text style={styles.signatureLine}>{formData.submissionDate ? formatDate(formData.submissionDate) : '............................'}</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Подпис:</Text>
              <Text style={styles.signatureLine}>..............................</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ZayavlenieZaOtsastvieTemplate
