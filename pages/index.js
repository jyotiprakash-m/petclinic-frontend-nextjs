import Head from 'next/head'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography;

// import { useEffect } from 'react';
// import axios from "axios";
export default function Home() {


  return (
    <Row>
      <Head>
        <title>Pet Care</title>
      </Head>
      <Col span={24} style={{ minHeight: "100vh" }}>
        <Title style={{ color: "rgb(49, 128, 255)" }} className={styles.heading}>Welcome to Pet Care</Title>
        <Row justify='center' style={{ marginTop: "4rem" }}>
          <Col sm={24} md={12} lg={8} xl={8}>
            <Row justify='center'>
              <Link href="/owner">
                <Card hoverable className={styles.card}>
                  <Row justify='center'>
                    <Title level={2} style={{ color: "rgb(49, 128, 255)" }}>Owner Service</Title>
                  </Row>
                </Card>
              </Link>
            </Row>
          </Col>
          <Col sm={24} md={12} lg={8} xl={8}>
            <Row justify='center'>
              <Link href="/vet">
                <Card hoverable className={styles.card}>
                  <Row justify='center'>
                    <Title level={2} style={{ color: "rgb(49, 128, 255)" }}>Vet Service</Title>
                  </Row>
                </Card>
              </Link>
            </Row>
          </Col>
          <Col sm={24} md={12} lg={8} xl={8}>
            <Row justify='center'>
              <Link href="/visit">
                <Card hoverable className={styles.card}>
                  <Row justify='center' >
                    <Title level={2} style={{ color: "rgb(49, 128, 255)" }}>Visit Service</Title>
                  </Row>
                </Card>
              </Link>
            </Row>
          </Col>
        </Row>
      </Col >
      <Col span={24}>
        <Footer />
      </Col>
    </Row >
  )
}
