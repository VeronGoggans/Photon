class DoneBoardSection():
    def __init__(self):
        self.board_section = 'Done'
        self.board_tasks = []

    def to_dict(self):
        return {
            'board_category': self.board_section,
            'board_tasks': self.board_tasks
        }