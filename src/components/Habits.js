import { useState, useEffect } from 'react';
import '../YourTime.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo } from 'react';
import { fetchHabits, updateHabitOrder, getMonthlyNotes, updateMonthlyNotes, 	addHabit,
	updateHabitGoal,
	updateHabitName,
	updateHabitProgress,
	deleteHabit, } from './contextHabits';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import DailyHabitsBarGraph from '../components/Graphs/DailyHabitsGraphs/DailyHabitsBarGraph';
import DailyHabitsLineGraph from '../components/Graphs/DailyHabitsGraphs/DailyHabitsLineGraph';
import DailyHabitsComposedGraph from '../components/Graphs/DailyHabitsGraphs/DailyHabitsComposedGraph';
import DailyHabitsAggregateGrid from '../components/Graphs/DailyHabitsGraphs/DailyHabitsAggregateGrid';
import DailyHabitsHeatMap from '../components/Graphs/DailyHabitsGraphs/DailyHabitsHeatMap';

ModuleRegistry.registerModules([AllCommunityModule]);

const DailyHabitsPage = () => {
	const [newHabit, setNewHabit] = useState('');
	const [rowData, setRowData] = useState([]);
	const today = new Date();
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());
	const [currentYear, setCurrentYear] = useState(today.getFullYear());
	const [monthlyNotes, setMonthlyNotes] = useState('');

	function getDaysOfCurrentMonth(year, month) {
		const days = [];
		const totalDays = new Date(year, month + 1, 0).getDate();

		for (let day = 1; day <= totalDays; day++) {
			const paddedMonth = String(month + 1).padStart(2, '0');
			const paddedDay = String(day).padStart(2, '0');
			days.push(`${year}-${paddedMonth}-${paddedDay}`);
		}
		return days;
	}

	const days = useMemo(
		() => getDaysOfCurrentMonth(currentYear, currentMonth),
		[currentYear, currentMonth]
	);

	const countTrueValues = (obj) => {
		let count = 0;
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === true) {
				count++;
			}
		}
		return count;
	};

	const handleRowDragEnd = async (event) => {
		const newData = [];
		const api = event.api;
		api.forEachNodeAfterFilterAndSort((node, index) => {
			newData.push({ id: node.data.id, order: index });
		});

		try {
			await updateHabitOrder(newData);
		} catch (err) {
			console.error('Failed to update habit order:', err);
		}
	};

	useEffect(() => {
		const loadHabits = async () => {
			try {
				const habitsFromApi = await fetchHabits();
				const processedHabits = habitsFromApi
					.sort((a, b) => a.order - b.order)
					.map((habit) => {
						const dailyData = {};
						days.forEach((day) => {
							dailyData[day] = habit.progress?.[day] || false;
						});
						const fullHabit = {
							id: habit._id,
							habit: habit.name,
							goal: habit.goal || 20,
							...dailyData,
						};
						fullHabit.achieved = countTrueValues(fullHabit);
						return fullHabit;
					});
				setRowData(processedHabits);
			} catch (err) {
				console.error('Failed to load habits:', err);
			}
		};
		loadHabits();
	}, [days]);

	useEffect(() => {
		const loadNotes = async () => {
			try {
				const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
				const notes = await getMonthlyNotes(key);
				setMonthlyNotes(notes || '');
			} catch (err) {
				console.error('Failed to load monthly notes:', err);
			}
		};
		loadNotes();
	}, [currentYear, currentMonth]);

	const handleAddHabit = async (e) => {
		e.preventDefault();
		if (!newHabit.trim()) return;

		try {
			const savedHabit = await addHabit(newHabit, 20);

			const dailyData = {};
			days.forEach((day) => {
				dailyData[day] = false;
			});

			setRowData([
				...rowData,
				{
					id: savedHabit._id,
					habit: savedHabit.name,
					goal: savedHabit.goal,
					...dailyData,
					achieved: 0,
				},
			]);
			setNewHabit('');
		} catch (err) {
			console.error('Failed to add habit:', err.message);
		}
	};

	const colDefs = useMemo(() => {
		const handleCheckboxChange = async (rowIndex, day) => {
			const newData = [...rowData];
			const habit = newData[rowIndex];
			const newValue = !habit[day];
			habit[day] = newValue;
			habit.achieved = countTrueValues(habit);
			setRowData(newData);

			try {
				await updateHabitProgress(habit.id, day, newValue);
			} catch (err) {
				console.error('Failed to update habit progress:', err);
			}
		};

		const workoutDays = {
			0: 'L', // Monday
			1: 'C', // Tueday
			2: 'L', // Wednesday
			3: 'C', // Thursday
			4: 'R', // Friday
			5: 'L', // Saturday
			6: 'C', // Sunday
		};

		const createCheckboxCol = (field) => {
			const shortDate = field.slice(5);
			const date = new Date(field);
			const dayIndex = date.getDay();
			const type = workoutDays[dayIndex];

			return {
				field,
				headerName: `${shortDate} (${type})`,
				width: 102,
				cellRenderer: (params) => (
					<input
						type="checkbox"
						className="styled-checkbox"
						name={`checkbox-${params.node.rowIndex}-${field}`}
						checked={params.value}
						onChange={() => handleCheckboxChange(params.node.rowIndex, field)}
					/>
				),
				cellStyle: () => {
					if (dayIndex === 0) {
						return {
							borderLeft: '2px solid black',
						};
					}
					return {};
				},
				headerClass: dayIndex === 0 ? 'sunday-header' : '',
			};
		};

		const cols = [];

		cols.unshift({
			headerName: '',
			field: 'drag',
			rowDrag: true,
			width: 40,
			sortable: false,
			suppressMenu: true,
			cellRenderer: 'agRowDragCellRenderer',
			pinned: 'left',
		});

		cols.push({ field: 'habit', editable: true, width: 200, pinned: 'left' });

		cols.push({
			field: 'goal',
			editable: true,
		});

		cols.push({
			field: 'achieved',
			pinned: 'left',
			cellStyle: (params) => {
				const achieved = params.value;
				const goal = params.data?.goal;

				if (achieved >= goal) {
					return { backgroundColor: '#d4edda' }; // light green
				} else if (goal - achieved <= 5) {
					return { backgroundColor: '#fff3cd' }; // light yellow
				} else {
					return { backgroundColor: '#f8d7da' }; // light red
				}
			},
		});

		for (let i = 0; i < days.length; i++) {
			cols.push(createCheckboxCol(days[i]));
		}

		cols.push({
			headerName: '',
			field: 'delete',
			width: 80,
			cellRenderer: (params) => {
				return (
					<button
						style={{
							padding: '4px 8px',
							backgroundColor: 'red',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
						onClick={async () => {
							try {
								await deleteHabit(params.data.id);
								setRowData((prevData) => prevData.filter((habit) => habit.id !== params.data.id));
							} catch (err) {
								console.error('Failed to delete habit:', err);
							}
						}}
					>
						Delete
					</button>
				);
			},
		});

		return cols;
	}, [days, rowData]);

	return (
		<div>
			<br></br>
			<div
				className="ag-theme-alpine"
				style={{ height: 500, width: '100%', marginBottom: '12rem' }}
			>
				<div className="top-bar">
					<form
						name="dailyHabitsForm"
						id="new-habit-form"
						onSubmit={handleAddHabit}
						className="habit-form"
					>
						<input
							type="text"
							id="new-habit-input"
							name="NewHabitFormInput"
							value={newHabit}
							onChange={(e) => setNewHabit(e.target.value)}
							placeholder="New habit name"
						/>
						<button type="submit">Add Habit</button>
					</form>
					<div className="month-nav">
						<button
							className="month-buttons"
							onClick={() => {
								setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
								if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
							}}
						>
							← Previous
						</button>

						<span className="month-label">
							{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}{' '}
							{currentYear}
						</span>

						<button
							className="month-buttons"
							onClick={() => {
								setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
								if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
							}}
						>
							Next →
						</button>
					</div>
				</div>
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					domLayout="autoHeight"
					rowDragManaged={true}
					onRowDragEnd={handleRowDragEnd}
					animateRows={true}
					defaultColDef={{
						width: 100,
						editable: true,
						resizable: true,
					}}
					onCellValueChanged={(params) => {
						const habitId = params.data.id;

						if (params.colDef.field === 'goal') {
							const newGoal = params.newValue;
							updateHabitGoal(habitId, newGoal).catch((err) =>
								console.error('Failed to update goal:', err)
							);
						} else if (params.colDef.field === 'habit') {
							const newName = params.newValue;
							updateHabitName(habitId, newName).catch((err) =>
								console.error('Failed to update habit name:', err)
							);
						}
					}}
				/>
			</div>
			<div style={ { padding: '2rem'  }}>
				<h3>Notes for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
				<textarea
					style={{ width: '100%', height: '150px', fontSize: '1rem', padding: '1rem' }}
					value={monthlyNotes}
					onChange={(e) => setMonthlyNotes(e.target.value)}
					onBlur={async () => {
						try {
							const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
							await updateMonthlyNotes(key, monthlyNotes);
						} catch (err) {
							console.error('Failed to update monthly notes:', err);
						}
					}}
					placeholder="Write your notes for this month..."
				/>
			</div>
			<div className="graph">
				<DailyHabitsAggregateGrid />
			</div>
			<div className="graph">
				<DailyHabitsBarGraph />
			</div>
			<div className="graph">
				<DailyHabitsLineGraph />
			</div>
			<div className="graph">
				<DailyHabitsComposedGraph />
			</div>
			<div className="graph">
				<DailyHabitsHeatMap rowData={rowData} />
			</div>
		</div>
	);
};

export default DailyHabitsPage;
