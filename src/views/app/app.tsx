import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Checkbox, Form, Input, List, Modal, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { VaporButton } from '../../components/vapor-button';
import { VaporLoader } from '../../components/vapor-loader';
import { VaporMessage } from '../../components/vapor-message';
import { Project, useProjects } from '../../solana/project';
import { useTasks } from '../../solana/task';
import { useUser } from '../../solana/user';
import { useWallet } from '../../solana/wallet';
import { AppMenu } from './components/app-menu';

export const App = React.memo(function App() {
	// Current wallet data for connection purposes
	const { connected: walletConnected, showDrawer: showWalletDrawer } = useWallet();
	// If wallet is not connected open directly the drawer to allow the user to connect
	// I show it here because in home i don't care about connection
	useEffect(() => {
		if (!walletConnected) {
			showWalletDrawer();
		}
	}, [walletConnected, showWalletDrawer]);

	// Get current user
	const { user } = useUser();
	// Get current user projects
	const { projects, createProject } = useProjects();

	// To keep the state of currently selected project
	const [selectedProject, setSelectedProject] = useState<Project | undefined>(
		projects.length ? projects[0] : undefined,
	);

	// Project form data to handle visibility and submit
	const [projectForm] = Form.useForm();
	const [projectModalVisible, setProjectModalVisible] = useState(false);
	const [confirmProjectModalLoading, setConfirmProjectModalLoading] = useState(false);

	const onAddProject = useCallback(() => {
		setProjectModalVisible(true);
	}, []);
	const onSelectProject = useCallback((project: Project) => {
		setSelectedProject(project);
	}, []);

	const handleProjectModalOk = useCallback(() => {
		console.log('Pressed project form add');
		projectForm.submit();
	}, [projectForm]);
	const handleProjectModalCancel = useCallback(() => {
		setProjectModalVisible(false);
	}, []);
	const onSubmitProjectForm = useCallback(
		(values) => {
			console.log('Project form submitted values', values);

			const onCreateProject = async () => {
				// Show loading indicator
				setConfirmProjectModalLoading(true);

				// Get data from the form to be saved
				// name max length is already determined with a filter on the input
				const data = { name: values.name };

				try {
					await createProject(data);
				} catch (error) {
					VaporMessage.error({ content: 'An error occurred creating a new project' });
					console.error('An error occurred creating a new project', error);
				}

				// Close everything that was open
				setProjectModalVisible(false);
				setConfirmProjectModalLoading(false);

				projectForm.resetFields();
			};

			onCreateProject();
		},
		[projectForm, createProject],
	);

	// Get all the tasks of the current project
	const { tasks, createTask } = useTasks(selectedProject);

	// Task form data to handle visibility and submit
	const [taskForm] = Form.useForm();
	const [taskModalVisible, setTaskModalVisible] = useState(false);
	const [confirmTaskModalLoading, setConfirmTaskModalLoading] = useState(false);

	const onCreateTask = useCallback(() => {
		setTaskModalVisible(true);
	}, []);
	const handleTaskModalOk = useCallback(() => {
		console.log('Pressed task form create');
		taskForm.submit();
	}, [taskForm]);
	const handleTaskModalCancel = useCallback(() => {
		setTaskModalVisible(false);
	}, []);

	const onSubmitTaskForm = useCallback(
		(values) => {
			console.log('Task form submitted values', values);

			const onCreateTask = async () => {
				// Show loading indicator
				setConfirmTaskModalLoading(true);

				// Get data from the form to be saved
				// max length is already determined with a filter on the input
				const data = { message: values.message, completed: false };

				try {
					await createTask(data);
				} catch (error) {
					VaporMessage.error({ content: 'An error occurred creating a new task' });
					console.error('An error occurred creating a new task', error);
				}

				// Close everything that was open
				setTaskModalVisible(false);
				setConfirmTaskModalLoading(false);

				taskForm.resetFields();
			};

			onCreateTask();
		},
		[taskForm, createTask],
	);

	// If no user show loading indicator until conected, otherwise show real app wrapper passing the user to be sure it's present
	return user ? (
		<>
			<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
				<AppMenu
					selectedProject={selectedProject}
					projects={projects}
					onAdd={onAddProject}
					onSelect={onSelectProject}
				/>

				<div style={{ flex: 1 }}>
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							paddingLeft: 24,
							paddingRight: 48,
						}}
					>
						<div
							style={{
								height: 80,
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<div style={{ flex: 1 }}>
								<div style={{}}>
									<Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
										{selectedProject?.data.name || 'No project selected'}
									</Typography.Title>
								</div>
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<div style={{}}>
									<VaporButton icon={<PlusOutlined />} danger={true} size={'large'} onClick={onCreateTask}>
										Create task
									</VaporButton>
								</div>

								<div style={{ marginLeft: 16 }}>
									<Avatar size="large">{user.data.name[0] || '-'}</Avatar>
								</div>
							</div>
						</div>

						<div style={{ flex: 1, marginTop: 24 }}>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									paddingTop: 12,
									paddingBottom: 8,
									paddingLeft: 16,
									paddingRight: 16,
								}}
							>
								<Typography.Text strong={true}>Tasks</Typography.Text>
							</div>

							<List
								dataSource={tasks}
								locale={{ emptyText: null }}
								renderItem={(item, index) => {
									const isFirst = index === 0;

									return (
										<List.Item style={{ cursor: 'pointer', padding: 0, marginTop: isFirst ? -2 : 0 }}>
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
													paddingTop: 14,
													paddingBottom: 12,
													paddingLeft: 16,
													paddingRight: 16,
												}}
											>
												<Checkbox
													checked={item.data.completed}
													onChange={(event) => console.log(event.target.checked)}
												/>

												<div style={{ marginLeft: 16 }}>
													<Typography.Text delete={item.data.completed}>{item.data.message}</Typography.Text>
												</div>
											</div>
										</List.Item>
									);
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<Modal
				title={
					<Typography.Title level={5} style={{ padding: 0, margin: 0 }}>
						{'Add project'}
					</Typography.Title>
				}
				okText={'Add'}
				cancelText={'Cancel'}
				centered={true}
				visible={projectModalVisible}
				confirmLoading={confirmProjectModalLoading}
				onOk={handleProjectModalOk}
				onCancel={handleProjectModalCancel}
			>
				<Form form={projectForm} layout="vertical" onFinish={onSubmitProjectForm}>
					<Form.Item
						name={'name'}
						label={<Typography.Text strong={true}>Name</Typography.Text>}
						rules={[{ required: true, message: '' }]}
						style={{ marginBottom: 0 }}
					>
						<Input maxLength={100} size={'large'} style={{ borderRadius: 8 }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={
					<Typography.Title level={5} style={{ padding: 0, margin: 0 }}>
						{'Create task'}
					</Typography.Title>
				}
				okText={'Create'}
				cancelText={'Cancel'}
				centered={true}
				visible={taskModalVisible}
				confirmLoading={confirmTaskModalLoading}
				onOk={handleTaskModalOk}
				onCancel={handleTaskModalCancel}
			>
				<Form form={taskForm} layout="vertical" onFinish={onSubmitTaskForm}>
					<Form.Item
						name={'message'}
						label={<Typography.Text strong={true}>Message</Typography.Text>}
						rules={[{ required: true, message: '' }]}
						style={{ marginBottom: 0 }}
					>
						<Input maxLength={140} size={'large'} style={{ borderRadius: 8 }} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	) : (
		<VaporLoader />
	);
});
