import React from 'react';
import 'whatwg-fetch';
import _ from 'lodash';
import util from './util';

import ChartPanel from './components/ChartPanel';
import Table from './components/WholeTable';
import StatisticCard from './components/StatisticCard';
import Notice from './components/Notice';
import CurrentHouse from './components/CurrentHouse';
import AreaBar from './components/AreaBar';
import config from './config/config';
import { Layout,Menu,Icon,Tabs } from 'antd';

import './App.less';
const { Header, Footer, Content } = Layout;
const TabPane = Tabs.TabPane;

class App extends React.Component {
	constructor(){
		super();
		this.state={
			allData: [],
			isTabChanged:false,
			activityKey:5
		};
		this.reloadData();
	}
	gotoGithub(){
		location.href='https://github.com/yhlben/cdfang-spider';
	}
	changeTab(activityKey){
		this.setState({
			activityKey: Number.parseInt(activityKey)
		});
	}
	reloadData(){
		fetch(config.serverDomain+'/getMongoData').then((response)=>response.json()).then(json=>{
			this.setState({
				allData:json
			});
		});
	}
	
	render() {
		var allData=this.state.allData;
		var areas=_.groupBy(allData,function(item){return item.area; } );
		var areasList=Object.keys(areas);
		var tabpanels=util.sortArea(areasList).map((item,index)=>{
			return (
				<TabPane tab={item} key={index}>
					<ChartPanel data={areas[item]} panelIndex={index} activityKey={this.state.activityKey}></ChartPanel>
				</TabPane>
			);
		});
		return (
			<div>
				<Layout>
					<Header style={{backgroundColor:'white'}}>
						<div className="logo">
							<Notice reloadData={this.reloadData.bind(this)}></Notice>
							<Icon type="github" onClick={this.gotoGithub} />
						</div>
						<Menu
							theme="light"
							mode="horizontal"
							defaultSelectedKeys={['1']}
							style={{ lineHeight: '64px' }}
						>
							<Menu.Item key="1">首页</Menu.Item>
						</Menu>
					</Header>
					<Content className="content">
						<CurrentHouse  data={this.state.allData}></CurrentHouse>
						<StatisticCard data={this.state.allData}></StatisticCard>
						<div className="content-graph-bar">
							<Tabs defaultActiveKey="5" onChange={this.changeTab.bind(this)}>
								{tabpanels}
							</Tabs>
						</div>
						<div className="content-areabar">
							<div className="content-areabar-title">整体统计</div>
							{
								this.state.allData.length>0?<AreaBar data={this.state.allData}></AreaBar>:''
							}
						</div>
						<div className="content-graph-table">
							{
								this.state.allData.length>0?<Table data={this.state.allData} areaList={areasList}></Table>:''
							}
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>Created by yhlben ©2018 </Footer>
				</Layout>
			</div>
		);
	}
}

export default App;
