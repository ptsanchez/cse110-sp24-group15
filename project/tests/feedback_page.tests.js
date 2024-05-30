const { makeSubmission } = require('../feedbackPage/feedback_page'); 

// Mock the alert function
global.alert = jest.fn();

// Mock the localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
};

// Mock the window.location.href
global.window = {
    location: { href: '' }
};

// Mock the document.getElementById
global.document = {
    getElementById: jest.fn((id) => {
        const elements = {
            "name": { value: '' },
            "email": { value: '' },
            "feedback": { value: '' },
        };
        return elements[id];
    }),
    querySelectorAll: jest.fn((selector) => {
        // Mock the querySelectorAll for radio buttons
        if (selector === 'input[type="radio"]:checked') {
            return [];
        }
        return [];
    })
};

describe('Submission Handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage to return an empty array when 'feedback_submissions' is requested
        localStorage.getItem.mockReturnValue(JSON.stringify([]));
    });

    test('Should alert if required fields are missing', () => {
        // Set empty values to mock invalid form inputs
        document.getElementById.mockImplementation((id) => {
            const elements = {
                "name": { value: '' },
                "email": { value: '' },
                "feedback": { value: '' },
            };
            return elements[id];
        });

        makeSubmission({ preventDefault: jest.fn() });
        expect(alert).toHaveBeenCalledWith("Please fill all required fields.");
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(window.location.href).toBe('');
    });

    test('Should successfully submit if all fields are valid', () => {
        document.getElementById.mockImplementation((id) => {
            const elements = {
                "name": { value: 'John Doe' },
                "email": { value: 'test@example.com' },
                "feedback": { value: 'Great job!' },
            };
            return elements[id];
        });

        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === 'input[type="radio"]:checked') {
                return [{ value: 'Very Satisfied' }];
            }
            return [];
        });

        makeSubmission({ preventDefault: jest.fn() });
        let testDate = new Date();
        const mockSubmission = {
            name: 'John Doe',
            email: 'test@example.com',
            feedback: 'Great job!',
            satisfaction: ['Very Satisfied'],
            date: testDate.toLocaleString()
        };
        expect(alert).toHaveBeenCalledWith('Thank you for your feedback!');
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'feedback_submissions',
            JSON.stringify([mockSubmission])
        );
        expect(window.location.href).toBe('../successPage/success_page.html');
    });
});
