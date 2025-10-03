"use client"

import * as React from "react"
import { FormField, FormSection } from "@/types/template"
import { getIconClassName, getGridClassName } from "@/lib/template-loader"

interface FormBuilderProps {
  formSchema: FormSection[]
  formData: Record<string, any>
  updateFormField: (field: string, value: string) => void
  updateDynamicListField: (field: string, index: number, subField: string, value: string) => void
  addDynamicListItem: (field: string) => void
  removeDynamicListItem: (field: string, index: number) => void
  getInputClassName: () => string
  isAuthenticated: boolean
}

export function FormBuilder({
  formSchema,
  formData,
  updateFormField,
  updateDynamicListField,
  addDynamicListItem,
  removeDynamicListItem,
  getInputClassName,
  isAuthenticated
}: FormBuilderProps) {
  const renderField = (field: FormField) => {
    const commonProps = {
      value: formData[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateFormField(field.id, e.target.value),
      className: getInputClassName(),
      readOnly: !isAuthenticated,
      placeholder: isAuthenticated ? field.placeholder : "Влезте в профила си за да използвате редактора"
    }

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            className={`${getInputClassName()} resize-none`}
          />
        )
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
          />
        )
      case 'dynamic_list':
        return renderDynamicList(field)
      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            maxLength={field.maxLength}
          />
        )
    }
  }

  const renderDynamicList = (field: FormField) => {
    if (!field.itemFields) return null
    
    const items = Array.isArray(formData[field.id]) ? formData[field.id] : []
    const minItems = field.minItems || 1
    const maxItems = field.maxItems || 10
    
    // Ensure we have at least minItems
    while (items.length < minItems) {
      items.push({})
    }

    return (
      <div className="space-y-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="p-4 border border-border rounded-lg bg-card/50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-text">
                {field.label} {index + 1}
              </h5>
              {items.length > minItems && isAuthenticated && (
                <button
                  type="button"
                  onClick={() => removeDynamicListItem(field.id, index)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                >
                  Премахни
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {field.itemFields?.map((subField) => (
                <div key={subField.id}>
                  <label className="block text-xs font-medium text-text mb-2">
                    {subField.label}
                  </label>
                  <input
                    type={subField.type}
                    value={item[subField.id] || ''}
                    onChange={(e) => updateDynamicListField(field.id, index, subField.id, e.target.value)}
                    className={getInputClassName()}
                    placeholder={isAuthenticated ? subField.placeholder : "Влезте в профила си за да използвате редактора"}
                    readOnly={!isAuthenticated}
                    maxLength={subField.maxLength}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {items.length < maxItems && isAuthenticated && (
          <button
            type="button"
            onClick={() => addDynamicListItem(field.id)}
            className="w-full py-2 px-4 border-2 border-dashed border-border rounded-lg text-sm text-muted hover:text-text hover:border-primary/50 transition-colors"
          >
            + Добави нов елемент
          </button>
        )}
      </div>
    )
  }

  const renderFieldGroup = (fields: FormField[]) => {
    // Group fields by gridSize for proper layout
    const groupedFields: FormField[][] = []
    let currentGroup: FormField[] = []
    
    fields.forEach(field => {
      if (field.gridSize === 'half' || field.gridSize === 'third') {
        currentGroup.push(field)
        
        // Check if we should close the group
        const totalParts = currentGroup.reduce((sum, f) => {
          return sum + (f.gridSize === 'third' ? 1/3 : f.gridSize === 'half' ? 1/2 : 1)
        }, 0)
        
        if (totalParts >= 1) {
          groupedFields.push([...currentGroup])
          currentGroup = []
        }
      } else {
        // Single field (full width)
        if (currentGroup.length > 0) {
          groupedFields.push([...currentGroup])
          currentGroup = []
        }
        groupedFields.push([field])
      }
    })
    
    // Add remaining fields
    if (currentGroup.length > 0) {
      groupedFields.push(currentGroup)
    }

    return groupedFields.map((group, groupIndex) => {
      if (group.length === 1 && !group[0].gridSize) {
        // Single full-width field
        const field = group[0]
        return (
          <div key={`${groupIndex}-${field.id}`}>
            <label className="block text-xs font-medium text-text mb-2">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        )
      } else {
        // Multiple fields in grid
        const gridClass = group[0].gridSize === 'third' ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-3'
        return (
          <div key={`group-${groupIndex}`} className={`grid ${gridClass}`}>
            {group.map(field => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-text mb-2">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        )
      }
    })
  }

  return (
    <div className="space-y-8">
      {formSchema.map((section) => (
        <div key={section.section}>
          <h4 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
            <div className={getIconClassName(section.icon)}></div>
            {section.title}
          </h4>
          <div className="space-y-4">
            {renderFieldGroup(section.fields)}
          </div>
        </div>
      ))}
    </div>
  )
}
