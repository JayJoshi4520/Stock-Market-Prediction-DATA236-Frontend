import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  LineChartOutlined,
  RiseOutlined,
  BarChartOutlined,
  ReadOutlined,
  MenuOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/analysis',
      icon: <LineChartOutlined />,
      label: <Link to="/analysis">Stock Analysis</Link>,
    },
    {
      key: '/technical',
      icon: <BarChartOutlined />,
      label: <Link to="/technical">Technical Analysis</Link>,
    },
    {
      key: '/predictions',
      icon: <RiseOutlined />,
      label: <Link to="/predictions">Predictions</Link>,
    },
    {
      key: '/blog',
      icon: <ReadOutlined />,
      label: <Link to="/blog">Blog</Link>,
    },
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show or hide the drawer
  const showDrawer = () => setIsDrawerVisible(true);
  const closeDrawer = () => setIsDrawerVisible(false);

  return (
    <Layout style={{ minHeight: '100vh', padding: 5}}>
      {/* Header */}
      <Header
        style={{
          backgroundColor: '#141414',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: windowWidth > 768 ? 'center' : 'flex-end', // Center menu on desktop, right-align button on mobile
        }}
      >
        {windowWidth > 768 ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              lineHeight: '64px',
            }}
          />
        ) : (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px', color: '#fff' }} />}
            onClick={showDrawer}
          />
        )}
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        open={isDrawerVisible}
        bodyStyle ={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={() => {setIsDrawerVisible(false)}}
        />
      </Drawer>

      <Content style={{ margin: '16px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
