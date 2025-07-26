import json
import random
import math
from typing import Dict, List, Optional, Any

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for the "Are Streaks Real?" experiment.
    
    Analyzes binary outcome sequences to determine if 2-success streaks
    actually predict a higher chance of a third success.
    
    Expected input:
    {
        "success_rate": float (0.1-0.9),
        "num_sequences": int (1-100000),
        "seed": int (optional)
    }
    
    Returns:
    {
        "snapshots": [
            {
                "sequences": int,
                "estimate": float,
                "input_rate": float,
                "difference": float
            }
        ],
        "final": {
            "sequences": int,
            "estimate": float,
            "input_rate": float,
            "difference": float
        }
    }
    """
    
    # Set CORS headers for API Gateway
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Parse input from different possible sources
        body = event.get('body', '{}')
        if isinstance(body, str):
            body = json.loads(body)
        
        # Extract parameters with validation
        success_rate = float(body.get('success_rate', 0.5))
        num_sequences = int(body.get('num_sequences', 10000))
        seed = body.get('seed')
        
        # Input validation
        if not (0.1 <= success_rate <= 0.9):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'success_rate must be between 0.1 and 0.9'
                })
            }
        
        if not (1 <= num_sequences <= 100000):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'num_sequences must be between 1 and 100000'
                })
            }
        
        # Set random seed if provided
        if seed is not None:
            random.seed(int(seed))
        
        # Run the streak analysis
        snapshots, final_result = analyze_streaks(success_rate, num_sequences)
        
        # Return results
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'snapshots': snapshots,
                'final': final_result
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'error': 'Invalid JSON in request body'
            })
        }
    except (ValueError, TypeError) as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'error': f'Invalid input parameters: {str(e)}'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': f'Internal server error: {str(e)}'
            })
        }

def analyze_streaks(success_rate: float, num_sequences: int) -> tuple[List[Dict], Dict]:
    """
    Analyze binary outcome sequences to find 2-success streaks and their outcomes.
    
    Args:
        success_rate: Probability of success (0.1-0.9)
        num_sequences: Number of sequences to analyze
        
    Returns:
        Tuple of (snapshots_list, final_result)
    """
    
    # Initialize counters
    total_streaks = 0
    successful_third_outcomes = 0
    snapshots = []
    
    # Determine snapshot intervals (every 10% of sequences, minimum 1)
    snapshot_interval = max(1, num_sequences // 10)
    
    # Process each sequence
    for sequence_num in range(1, num_sequences + 1):
        # Generate a sequence of 100 binary outcomes
        sequence = generate_binary_sequence(100, success_rate)
        
        # Find all non-overlapping 2-success streaks and their outcomes
        sequence_streaks, sequence_successes = find_streak_outcomes(sequence)
        
        # Update global counters
        total_streaks += sequence_streaks
        successful_third_outcomes += sequence_successes
        
        # Take snapshot at intervals
        if sequence_num % snapshot_interval == 0 or sequence_num == num_sequences:
            estimate = calculate_estimate(successful_third_outcomes, total_streaks)
            
            snapshot = {
                'sequences': sequence_num,
                'estimate': round(estimate, 6),
                'input_rate': round(success_rate, 6),
                'difference': round(estimate - success_rate, 6)
            }
            snapshots.append(snapshot)
    
    # Calculate final result
    final_estimate = calculate_estimate(successful_third_outcomes, total_streaks)
    final_result = {
        'sequences': num_sequences,
        'estimate': round(final_estimate, 6),
        'input_rate': round(success_rate, 6),
        'difference': round(final_estimate - success_rate, 6)
    }
    
    return snapshots, final_result

def generate_binary_sequence(length: int, success_rate: float) -> List[int]:
    """
    Generate a sequence of binary outcomes (0 or 1) with given success rate.
    
    Args:
        length: Length of sequence
        success_rate: Probability of success (1)
        
    Returns:
        List of binary outcomes
    """
    return [1 if random.random() < success_rate else 0 for _ in range(length)]

def find_streak_outcomes(sequence: List[int]) -> tuple[int, int]:
    """
    Find all non-overlapping 2-success streaks and count successful third outcomes.
    
    Args:
        sequence: List of binary outcomes
        
    Returns:
        Tuple of (total_streaks, successful_third_outcomes)
    """
    total_streaks = 0
    successful_third_outcomes = 0
    i = 0
    
    # Scan through sequence looking for 2-success streaks
    while i < len(sequence) - 2:
        # Check if we have two consecutive successes
        if sequence[i] == 1 and sequence[i + 1] == 1:
            # We found a 2-success streak, check the outcome after it
            if sequence[i + 2] == 1:
                successful_third_outcomes += 1
            total_streaks += 1
            # Skip overlapping streaks by moving 2 positions forward
            i += 2
        else:
            # No streak found, move to next position
            i += 1
    
    return total_streaks, successful_third_outcomes

def calculate_estimate(successful_outcomes: int, total_outcomes: int) -> float:
    """
    Calculate the estimated probability of success after a 2-success streak.
    
    Args:
        successful_outcomes: Number of successful third outcomes
        total_outcomes: Total number of 2-success streaks found
        
    Returns:
        Estimated probability (0.0 if no streaks found)
    """
    if total_outcomes == 0:
        return 0.0
    return successful_outcomes / total_outcomes

# Test function for local development
def test_local():
    """Test the function locally without AWS Lambda."""
    test_event = {
        'body': json.dumps({
            'success_rate': 0.5,
            'num_sequences': 1000,
            'seed': 42
        })
    }
    
    result = lambda_handler(test_event, None)
    print("Test Result:")
    print(json.dumps(json.loads(result['body']), indent=2))

if __name__ == "__main__":
    # Run local test
    test_local() 