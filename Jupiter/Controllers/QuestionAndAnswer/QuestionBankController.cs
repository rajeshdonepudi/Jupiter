using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.QuestionAndAnswer
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionBankController : BaseSecureController
    {
        private readonly IQuestionBankService _questionBankService;

        public QuestionBankController(IQuestionBankService questionBankService)
        {
            _questionBankService = questionBankService;
        }

        [HttpPost("all-question-banks")]
        public async Task<IActionResult> GetAllQuestionBanks(FilterQuestionBanksDto model, CancellationToken cancellationToken)
        {
            var result = await _questionBankService.GetAllQuestionBanksAsync(model, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{questionBankId}")]
        public async Task<IActionResult> GetQuestionBank(Guid questionBankId, CancellationToken cancellationToken)
        {
            var result = await _questionBankService.GetQuestionBankAsync(questionBankId, cancellationToken);
            return Ok(result);
        }

        [HttpPut("upsert-question-bank")]
        public async Task<IActionResult> UpsertQuestionBank(QuestionBankDto model, CancellationToken cancellationToken)
        {
            await _questionBankService.UpsertQuestionBankAsync(model, cancellationToken);
            return Ok();
        }

        [HttpDelete("{questionBankId}")]
        public async Task<IActionResult> DeleteQuestionBank(Guid questionBankId, CancellationToken cancellationToken)
        {
            await _questionBankService.DeleteQuestionBankAsync(questionBankId, cancellationToken);
            return NoContent();
        }
    }
}
