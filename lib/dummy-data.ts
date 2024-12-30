export const dummyKanbanData = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: '1',
          title: 'Research competitors',
          description: 'Analyze top 5 competitors in the market',
        },
        {
          id: '2',
          title: 'Design system',
          description: 'Create a consistent design system for the platform',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: '3',
          title: 'User authentication',
          description: 'Implement OAuth and email authentication',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [
        {
          id: '4',
          title: 'API documentation',
          description: 'Write comprehensive API documentation',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '5',
          title: 'Project setup',
          description: 'Initialize repository and setup CI/CD',
        },
      ],
    },
  ],
};

export const dummyTableData = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-04-15',
    assignee: 'John Doe',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'Planning',
    priority: 'Medium',
    dueDate: '2024-05-01',
    assignee: 'Jane Smith',
  },
  {
    id: '3',
    name: 'API Integration',
    status: 'Review',
    priority: 'High',
    dueDate: '2024-04-10',
    assignee: 'Mike Johnson',
  },
];

export const dummyGanttData = [
  {
    id: '1',
    task: 'Research',
    start: '2024-04-01',
    end: '2024-04-15',
    progress: 60,
  },
  {
    id: '2',
    task: 'Design',
    start: '2024-04-15',
    end: '2024-05-01',
    progress: 30,
  },
  {
    id: '3',
    task: 'Development',
    start: '2024-05-01',
    end: '2024-06-15',
    progress: 0,
  },
];