import React, { useState } from 'react'
import { Card, Tabs } from 'antd';
import VisitComponent from '../components/visit/VisitComponent';
import PetComponent from '../components/visit/PetComponent';
import Head from 'next/head';
import Footer from '../components/Footer';
const { TabPane } = Tabs;
const Visit = () => {
    const [activeKey, setActiveKey] = useState("1")

    const onTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <Head>
                <title>Visit Service</title>
            </Head>
            <Card bordered={false} title={<h2>Vist Service</h2>} style={{ minHeight: "100vh" }}>
                <Tabs defaultActiveKey={activeKey} onChange={onTabChange}>
                    <TabPane tab="Visit Table" key="1">
                        <VisitComponent />
                    </TabPane>
                    <TabPane tab="Pet Table" key="2">
                        <PetComponent />
                    </TabPane>
                </Tabs>
            </Card>
            <Footer />
        </>
    )
}

export default Visit