ESCALATION_SIGNALS = [
    "[ESCALATE]",
    "transfer me to a human",
    "connect me with an agent",
]

NEGATIVE_SIGNALS = [
    "this is unacceptable",
    "i want to speak to a manager",
    "you're useless",
]


def check_escalation(response: str) -> bool:
    response_lower = response.lower()
    return any(
        signal.lower() in response_lower
        for signal in ESCALATION_SIGNALS + NEGATIVE_SIGNALS
    )
