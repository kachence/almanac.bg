"use client"

import * as React from "react"
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faFacebook } from "@fortawesome/free-brands-svg-icons"

const navigation = {
  main: [
    { name: 'Имен ден А–Я', href: '/imen-den' },
    { name: 'Празници 2025', href: '/praznici/2025' },
    { name: 'Календар 2025', href: '/kalendar/2025' },
    { name: 'Картички', href: '/kartichki' },
  ],
  holidays: [
    { name: 'Официални празници', href: '/praznici/oficialni' },
    { name: 'Православни празници', href: '/praznici/pravoslavni' },
    { name: 'Професионални дни', href: '/praznici/profesionalni' },
    { name: 'Работни дни', href: '/rabotni-dni' }
  ],
  company: [
    { name: 'За нас', href: '/za-nas' },
    { name: 'Източници', href: '/izvori' },
    { name: 'Въпроси и отговори', href: '/faq' }
  ],
  legal: [
    { name: 'Поверителност', href: '/privacy' },
    { name: 'Условия', href: '/tos' },
    { name: 'Източници на данни', href: '/izvori' }
  ]
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">        
        <div className="pt-12 lg:pt-16 xl:grid xl:grid-cols-3 xl:gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-9 w-9 rounded-xl grid place-items-center">
                <FontAwesomeIcon icon={faCalendar} className="text-lg text-primary" />
              </div>
              <span className="font-semibold tracking-tight text-primary text-xl">almanac.bg</span>
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              Пълен календар за България с имени дни, православни и официални празници, работни и почивни дни. 
              Точни данни, бързо търсене и удобни напомняния.
            </p>
            <div className="flex gap-x-4 mt-6">
              <a href="https://facebook.com/almanacbg" className="text-muted hover:text-text transition-colors">
                <span className="sr-only">Facebook</span>
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a href="mailto:contact@almanac.bg" className="text-muted hover:text-text transition-colors">
                <span className="sr-only">Email</span>
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-text">Календар</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm/6 text-muted hover:text-text transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-text">Празници</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.holidays.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm/6 text-muted hover:text-text transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-text">Информация</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm/6 text-muted hover:text-text transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-text">Правни условия</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm/6 text-muted hover:text-text transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border py-8">
          <div className="text-center">
            <p className="text-sm/6 text-muted">
              &copy; {currentYear} Almanac.bg. Всички права запазени.
            </p>
            <p className="mt-2 text-xs text-muted">
              Данните се обновяват ежегодно на база официални източници (БПЦ, Министерски съвет). 
              Моля, проверете за местни промени.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
