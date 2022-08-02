import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const SpecialtyComponent = () => {
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSpeciality, setSelectedSpeciality] = useState({});
    const [task, setTask] = useState("");
    // Form variables
    const [addEditSpecialityForm] = Form.useForm();

    // Modal variable
    const [isAddEditSpecialityModalVisible, setIsSaveEditSpecialityModalVisible] = useState(false);

    // Initial fetch 
    useEffect(() => {
        setLoading(true);
        axios.get("api/speciality/get")
            .then((res) => {
                setSpecialities(res.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => { console.log(err) });
    }, [])

    // Delete valid pet
    const showPetDeleteConfirm = (specialtyId) => {
        confirm({
            title: 'Are you sure delete this pet',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // delete/{id}
                setLoading(true);
                axios.delete(`api/speciality/delete/${specialtyId}`)
                    .then((res) => {
                        message.success(res.data.status);
                    })
                    .then(() => {
                        axios.get("api/speciality/get")
                            .then((res) => {
                                setSpecialities(res.data);
                            })
                            .catch((err) => { console.log(err) });
                    })
                    .then(() => {
                        setLoading(false);
                    })
                    .catch((err) => { console.log(err); message.warning(err.response.data.status); });
            },

        });
    }

    // Edit/Add valid pet
    const showAddEditSpecialityModal = () => {
        setIsSaveEditSpecialityModalVisible(true);
    };
    const handleAddEditSpecialityCancel = () => {
        setIsSaveEditSpecialityModalVisible(false);
        setTask("");
        addEditSpecialityForm.resetFields();
        setSelectedSpeciality({})
    };
    const editSpeciality = (speciality) => {
        setIsSaveEditSpecialityModalVisible(true);
        addEditSpecialityForm.setFieldsValue(speciality);
        setSelectedSpeciality(speciality);
    }

    const onFinishAddEditSpeciality = (values) => {

        if (task === "edit") {
            values.specialtyId = selectedSpeciality.specialtyId;
            setLoading(true);
            axios.put(`api/speciality/update/${selectedSpeciality.specialtyId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/speciality/get")
                        .then((res) => {
                            setSpecialities(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });

        } else if (task === "save") {
            axios.post(`api/speciality/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/speciality/get")
                        .then((res) => {
                            setSpecialities(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });
        }
        setTask("");
        setIsSaveEditSpecialityModalVisible(false);
        addEditSpecialityForm.resetFields();
    }

    // Valid pet column
    const specialityColumns = [
        {
            title: 'SL. No',
            dataIndex: 'specialtyId',
            key: 'slNo',
            render: (specialtyId, speciality, i) => <span>{i + 1}</span>,
        },

        {
            title: 'Speciality',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            dataIndex: 'specialtyId',
            key: 'action',
            render: (specialtyId, speciality, i) => (
                <>
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editSpeciality(speciality); setTask("edit"); }}>Edit</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => showPetDeleteConfirm(specialtyId)}>Delete</Button>
                </>
            )

        },
    ]

    return (
        <Card bordered={false} title="Specialty Information" extra={<Button type="primary" onClick={() => { showAddEditSpecialityModal(); setTask("save"); }}>Add</Button>} >
            <Row>
                <Col span={24}>
                </Col>
            </Row>

            <Table
                columns={specialityColumns}
                dataSource={specialities}
                rowKey={(record) => record.specialtyId}
                pagination={false}
                loading={loading}
            />
            <Modal title="Add or update Speciality" visible={isAddEditSpecialityModalVisible} onCancel={handleAddEditSpecialityCancel} footer={null}>
                <Form form={addEditSpecialityForm} onFinish={onFinishAddEditSpeciality}>
                    <Form.Item name="name" label="Speciality" rules={[{ required: true }]}>
                        <Input placeholder="Enter the speciality" />
                    </Form.Item>
                    <Row justify='end'>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Row>
                </Form>
            </Modal>

        </Card>
    )
}

export default SpecialtyComponent