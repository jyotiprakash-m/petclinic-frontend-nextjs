import React, { useState } from 'react'
import { Card, Tabs } from 'antd';
import OwnerComponent from '../components/owner/OwnerComponent';
import ValidPetsComponent from '../components/owner/ValidPetsComponent';
import Footer from '../components/Footer';
import Head from 'next/head';
const { TabPane } = Tabs;
const Owner = () => {
    const [activeKey, setActiveKey] = useState("1")

    const onTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <Head>
                <title>Owner Service</title>
            </Head>
            <Card bordered={false} title={<h2>Owner Service</h2>}  >

                <Tabs defaultActiveKey={activeKey} onChange={onTabChange} style={{ minHeight: "100vh" }}>
                    <TabPane tab="Owner Table" key="1">
                        <OwnerComponent />
                    </TabPane>
                    <TabPane tab="Valid pet table" key="2">
                        <ValidPetsComponent />
                    </TabPane>
                </Tabs>
            </Card>
            <Footer />
        </>
    )
}

export default Owner