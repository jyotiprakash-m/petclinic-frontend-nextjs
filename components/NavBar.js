import React from 'react'
import styles from '../styles/Home.module.css'
import { Col, Row } from 'antd'
import Link from 'next/link'
const NavBar = () => {
  return (
    <Row className={styles.nav}>
      <Col span={12}>
        <h2>
          <Link href="/">
            <a className={styles.link}>Pet Care</a>
          </Link>
        </h2>
      </Col>
      <Col span={12} >
        <Row>
          <Col span={8}>
            <Link href="/owner">
              <a className={styles.link}>Owner</a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/vet">
              <a className={styles.link}>Veterinary</a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/visit">
              <a className={styles.link}>Visit</a>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default NavBar