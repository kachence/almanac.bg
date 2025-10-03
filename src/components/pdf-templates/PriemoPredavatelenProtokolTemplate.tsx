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
  title: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  header: {
    marginBottom: 25,
  },
  headerLine: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'baseline',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  underline: {
    marginLeft: 5,
    flex: 1,
  },
  partySection: {
    marginBottom: 20,
  },
  partyLine: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'baseline',
  },
  partyNumber: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    minWidth: 15,
  },
  partyUnderline: {
    marginLeft: 5,
    flex: 1,
  },
  protocolText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemsSection: {
    marginBottom: 20,
  },
  itemLine: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  itemNumber: {
    fontSize: 12,
    fontFamily: 'Roboto',
    minWidth: 15,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
    marginLeft: 5,
  },
  itemDescription: {
    marginBottom: 8,
  },
  itemCondition: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'baseline',
  },
  itemContract: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dots: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  conditionLabel: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  contractLabel: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  finalNote: {
    fontSize: 11,
    fontFamily: 'Roboto',
    textAlign: 'left',
    marginTop: 10,
  },
})

interface ProtocolItem {
  description?: string
  condition?: string
  contractReference?: string
}

interface PriemoPredavatelenProtokolTemplateProps {
  formData: {
    protocolDate?: string
    protocolLocation?: string
    givingPartyName?: string
    givingPartyEin?: string
    givingPartyAddress?: string
    givingPartyRepresentative?: string
    givingPartyRepresentativeEgn?: string
    givingPartyCapacity?: string
    receivingPartyName?: string
    receivingPartyEin?: string
    receivingPartyAddress?: string
    receivingPartyRepresentative?: string
    receivingPartyRepresentativeEgn?: string
    receivingPartyCapacity?: string
    items?: ProtocolItem[]
  }
}

const PriemoPredavatelenProtokolTemplate: React.FC<PriemoPredavatelenProtokolTemplateProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '...........................'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  // Default to 3 items if none provided, ensure it's always an array
  const items = Array.isArray(formData.items) && formData.items.length > 0 
    ? formData.items 
    : [{}, {}, {}]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Приемо-предавателен протокол</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLine}>
            <Text style={styles.label}>Днес,</Text>
            <Text style={[styles.underline, { minWidth: 110, maxWidth: 110 }]}>{formData.protocolDate ? formatDate(formData.protocolDate) : '................................'}</Text>
            <Text style={styles.label}> г., в </Text>
            <Text style={[styles.underline, { minWidth: 160, maxWidth: 160 }]}>{formData.protocolLocation || '................................................'}</Text>
            <Text style={styles.label}>, между:</Text>
          </View>
        </View>

        {/* Party 1 - Giving */}
        <View style={styles.partySection}>
          <View style={styles.partyLine}>
            <Text style={styles.partyNumber}>1.</Text>
            <Text style={[styles.partyUnderline, { flex: 1, minWidth: 80 }]}>{formData.receivingPartyName || '.............................................................................'}</Text>
            <Text style={styles.label}>, с ЕИК/ЕГН </Text>
            <Text style={[styles.partyUnderline, { maxWidth: 140 }]}>{formData.receivingPartyEin || '...........................................'}</Text>
            <Text style={styles.label}>,</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>със седалище/адрес: </Text>
            <Text style={styles.partyUnderline}>{formData.givingPartyAddress || '........................................................................................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>представлявано от </Text>
            <Text style={styles.partyUnderline}>{formData.givingPartyRepresentative || '........................................................................................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>с ЕГН </Text>
            <Text style={styles.partyUnderline}>{formData.givingPartyRepresentativeEgn || '................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>в качеството му на </Text>
            <Text style={styles.partyUnderline}>{formData.givingPartyCapacity || '...................................................................'}</Text>
          </View>
        </View>

        {/* "и" separator */}
        <Text style={[styles.label, { textAlign: 'center', marginTop: 5, marginBottom: 25 }]}>и</Text>

        {/* Party 2 - Receiving */}
        <View style={styles.partySection}>
          <View style={styles.partyLine}>
            <Text style={styles.partyNumber}>2.</Text>
            <Text style={[styles.partyUnderline, { flex: 1, minWidth: 80 }]}>{formData.receivingPartyName || '.............................................................................'}</Text>
            <Text style={styles.label}>, с ЕИК/ЕГН </Text>
            <Text style={[styles.partyUnderline, { maxWidth: 140 }]}>{formData.receivingPartyEin || '...........................................'}</Text>
            <Text style={styles.label}>,</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>със седалище/адрес: </Text>
            <Text style={styles.partyUnderline}>{formData.receivingPartyAddress || '........................................................................................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>представлявано от </Text>
            <Text style={styles.partyUnderline}>{formData.receivingPartyRepresentative || '........................................................................................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>с ЕГН </Text>
            <Text style={styles.partyUnderline}>{formData.receivingPartyRepresentativeEgn || '................................,'}</Text>
          </View>
          
          <View style={styles.partyLine}>
            <Text style={styles.label}>в качеството му на </Text>
            <Text style={styles.partyUnderline}>{formData.receivingPartyCapacity || '...................................................................'}</Text>
          </View>
        </View>

        {/* Protocol text */}
        <Text style={styles.protocolText}>
          се съставя настоящият приемо-предавателен протокол.
        </Text>

        <Text style={[styles.protocolText, { textAlign: 'left', marginBottom: 20 }]}>
          Предаващата страна предава, а приемащата страна приема, както следва:
        </Text>

        {/* Items list */}
        <View style={styles.itemsSection}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemLine}>
              <Text style={styles.itemNumber}>{index + 1}.</Text>
              <View style={styles.itemContent}>
                <View style={styles.itemCondition}>
                  <Text style={styles.dots}>
                    {'.......................................................................................................................'}
                  </Text>
                  <Text style={styles.conditionLabel}>, забележки по</Text>
                </View>
                
                <View style={styles.itemCondition}>
                  <Text style={styles.conditionLabel}>състоянието: </Text>
                  <Text style={styles.dots}>
                    {item.condition || '................................................................................................................'}
                  </Text>
                </View>
                
                <View style={styles.itemCondition}>
                  <Text style={styles.dots}>
                    {'...............................................................................................................................................'}
                  </Text>
                  <Text style={styles.conditionLabel}>,</Text>
                </View>
                
                <View style={styles.itemContract}>
                  <Text style={styles.contractLabel}>по договор/фактура: </Text>
                  <Text style={styles.dots}>
                    {item.contractReference || '...........................................................................................................'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.finalNote}>
          Настоящият протокол се изготви в два еднообразни екземпляра, по един за всяка от страните.
        </Text>
      </Page>
    </Document>
  )
}

export default PriemoPredavatelenProtokolTemplate
