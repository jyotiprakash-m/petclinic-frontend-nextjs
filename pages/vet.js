import React, { useState } from 'react'
import { Card, Tabs } from 'antd';
import VetComponent from '../components/vet/VetComponent';
import SpecialtyComponent from '../components/vet/SpecialtyComponent';
import Head from 'next/head';
import Footer from '../components/Footer';
const { TabPane } = Tabs;
const Vet = () => {
    const [activeKey, setActiveKey] = useState("1")

    const onTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <Head>
                <title>Vet Service</title>
            </Head>
            <Card bordered={false} title={<h2>Vet Service</h2>} style={{ minHeight: "100vh" }}>
                <Tabs defaultActiveKey={activeKey} onChange={onTabChange}>
                    <TabPane tab="Vet Table" key="1">
                        <VetComponent />
                    </TabPane>
                    <TabPane tab="Specialty Table" key="2">
                        <SpecialtyComponent />
                    </TabPane>
                </Tabs>

            </Card>
            <Footer />
        </>
    )
}

export default Vet