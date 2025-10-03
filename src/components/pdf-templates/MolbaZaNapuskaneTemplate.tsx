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
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
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
    marginBottom: 40,
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
    marginVertical: 35,
    letterSpacing: 4,
  },
  fromSection: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  content: {
    marginBottom: 20,
    textAlign: 'justify',
  },
  paragraph: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.4,
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
  smallText: {
    fontSize: 11,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: 30,
  },
})

interface MolbaZaNapuskaneTemplateProps {
  formData: {
    companyName?: string
    managerName?: string
    fullName?: string
    egn?: string
    position?: string
    resignationDate?: string
    submissionDate?: string
    submissionCity?: string
  }
}

const MolbaZaNapuskaneTemplate: React.FC<MolbaZaNapuskaneTemplateProps> = ({ formData }) => {
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
            <View style={styles.toField}>
              <Text style={styles.label}>ДО</Text>
              <Text style={styles.underline}>{formData.managerName || '........................................................'}</Text>
            </View>
            <View style={styles.toField}>
              <Text style={styles.label}>УПРАВИТЕЛ НА</Text>
              <Text style={styles.underline}>{formData.companyName || '........................................................'}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>М О Л Б А</Text>

        {/* From Section */}
        <View style={styles.fromSection}>
          <Text style={styles.label}>ОТ</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '60%' }]}>{formData.fullName || '.....................................................................................,'}</Text>
          <Text style={styles.label}> ЕГН</Text>
          <Text style={[styles.underline, { minWidth: 120 }]}>{formData.egn || '........................................'}</Text>
        </View>

        <View style={[styles.fromSection, { justifyContent: 'center', marginBottom: 30 }]}>
          <Text style={styles.label}>на длъжност</Text>
          <Text style={styles.underline}>{formData.position || '.............................................................'}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Уважаеми Г-н/Г-жо{formData.managerName ? ` ${formData.managerName}` : '  ................................................'},
          </Text>

          <Text style={styles.paragraph}>
            С настоящата молба и на основание чл.325, т.1 от КТ, Ви моля за Вашето съгласие за 
            прекратяване на трудовото ми правоотношение, считано от{formData.resignationDate ? ` ${formatDate(formData.resignationDate)}` : '........................'} от заеманата от мен 
            длъжност в представляваната от Вас фирма.
          </Text>

          <Text style={styles.paragraph}>
            В случай, че молбата ми не бъде приета, същата да се счита за едномесечно писмено 
            предизвестие по чл.326, ал.1 от КТ.
          </Text>

          <Text style={styles.paragraph}>
            Моля да оформите трудовата ми книжка и всички други необходими документи и да ми ги 
            предадете.
          </Text>

          <Text style={styles.paragraph}>
            Надявам се молбата ми да бъде удовлетворена.
          </Text>
        </View>

        <Text style={styles.smallText}>
          Молбата е изготвена в два екземпляра.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Дата</Text>
              <Text style={styles.signatureLine}>{formData.submissionDate ? formatDate(formData.submissionDate) : '................................'}</Text>
            </View>
            <View style={styles.footerField}>
              <Text style={styles.label}>Град</Text>
              <Text style={styles.signatureLine}>{formData.submissionCity || '.................................'}</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.footerField}>
              <Text style={styles.label}>С уважение:</Text>
              <Text style={styles.signatureLine}>............................................</Text>
            </View>
            <View style={[styles.footerField, { marginTop: 10 }]}>
              <Text style={[styles.signatureLine, { fontSize: 12 }]}>{formData.fullName || '/................................................................/'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default MolbaZaNapuskaneTemplate
