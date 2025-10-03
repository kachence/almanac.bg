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
    padding: 45,
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
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
    marginBottom: 35,
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
  bulletPoint: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginLeft: 20,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
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
    marginBottom: 5,
  },
  signatureLine: {
    minWidth: 150,
    marginLeft: 5,
  },
})

interface ZhalbaKZPTemplateProps {
  formData: {
    complainantName?: string
    complainantEGN?: string
    complainantAddress?: string
    complainantEmail?: string
    respondentName?: string
    respondentEIK?: string
    respondentAddress?: string
    violationDescription?: string
    requestedAction?: string
    submissionDate?: string
    submissionCity?: string
  }
}

const ZhalbaKZPTemplate: React.FC<ZhalbaKZPTemplateProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '........................'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
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
            <Text style={[styles.label, { textAlign: 'center' }]}>
              До: Председателя на Комисия за {'\n'}защита на потребителите
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Ж А Л Б А</Text>

        {/* From Section */}
        <View style={styles.fromSection}>
          <Text style={styles.label}>От:</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '75%' }]}>{formData.complainantName || '..............................................................................................,'}</Text>
          <Text style={styles.label}> с ЕГН</Text>
          <Text style={[styles.underline, { minWidth: 120 }]}>{formData.complainantEGN || '................................,'}</Text>
        </View>

        <View style={[styles.fromSection, { marginBottom: 15 }]}>
          <Text style={styles.label}>с постоянен адрес</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '75%' }]}>{formData.complainantAddress || '...................................................................................................................'}</Text>
        </View>

        {/* Against Section */}
        <View style={styles.fromSection}>
          <Text style={styles.label}>Срещу:</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '60%' }]}>{formData.respondentName || '......................................................................................,'}</Text>
          <Text style={styles.label}> с ЕИК</Text>
          <Text style={[styles.underline, { minWidth: 120 }]}>{formData.respondentEIK || '................................,'}</Text>
        </View>

        <View style={[styles.fromSection, { marginBottom: 15 }]}>
          <Text style={styles.label}>със седалище и адрес на управление</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '65%' }]}>{formData.respondentAddress || '................................................................................'}</Text>
        </View>

        {/* Salutation */}
        <Text style={[styles.paragraph, { textAlign: 'left', marginBottom: 15 }]}>
          Уважаеми г-н/г-жо Председател,
        </Text>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            С настоящата жалба сезирам представляваната от Вас Комисия във връзка с
            нарушаване на моите права като потребител при следните обстоятелства:
          </Text>

          <View>
            <Text style={styles.paragraph}>
              {formData.violationDescription || '..................................................................................................................................................'}
            </Text>
          </View>

          <Text style={[styles.bulletPoint, { marginLeft: 0, marginBottom: 10 }]}>
            Искане:
          </Text>

          <View>
            <Text style={styles.paragraph}>
              {formData.requestedAction || '..................................................................................................................................................'}
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Моля, във връзка с така изложените от мен обстоятелства, да образувате преписка
            и, в случай че е необходимо, да извършите проверка, която да установи дали правата ми
            като потребител са били нарушени от търговеца.
          </Text>

          <Text style={styles.paragraph}>
            В случай че установите извършване на нарушение на потребителските ми права,
            моля да постановите решение, в което да установите нарушението, както и да
            постановите налагане на предвидените в закона административни мерки, включително
            глоби и имуществени санкции.
          </Text>

          <Text style={styles.paragraph}>
            В случай че жалбата е неправилно адресирана до Комисия за защита на
            потребителите, моля същата да бъде препратена по компетентност на съответния орган и
            да ми бъде изпратено уведомление.
          </Text>

          <Text style={styles.paragraph}>
            Моля, всички необходими съобщения във връзка с производството по жалбата да
            ми бъдат изпращани на електронната ми поща с адрес: 
          </Text>

          <Text style={styles.paragraph}>
            {formData.complainantEmail || '.....................................................................'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Дата:</Text>
              <Text style={[styles.signatureLine, { minWidth: 110 }]}>{formData.submissionDate ? formatDate(formData.submissionDate) : '..................................'}</Text>
              <Text style={styles.label}> г.</Text>
            </View>
            <View style={[styles.footerField, { marginTop: 15 }]}>
              <Text style={styles.label}>Гр./с.:</Text>
              <Text style={styles.signatureLine}>{formData.submissionCity || '.................................'}</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Подпис:</Text>
              <Text style={styles.signatureLine}>............................................</Text>
            </View>
            <View style={[styles.footerField, { marginTop: 15 }]}>
              <Text style={[styles.signatureLine, { fontSize: 12 }]}>{formData.complainantName || '/........................................................../'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ZhalbaKZPTemplate
